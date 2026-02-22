-- Atomic token-bucket implemented with Redis hash.
--
-- KEYS[1] = bucket key
-- ARGV[1] = capacity (double)
-- ARGV[2] = refill_per_sec (double)
-- ARGV[3] = now_millis (long)
--
-- Returns pipe-delimited string: allowed|remaining_int|retry_after_millis

local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_per_sec = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local current_tokens = redis.call('HGET', key, 't')
local last_ts = redis.call('HGET', key, 'ts')

if current_tokens == false then
  current_tokens = capacity
else
  current_tokens = tonumber(current_tokens)
end

if last_ts == false then
  last_ts = now
else
  last_ts = tonumber(last_ts)
end

local elapsed_ms = now - last_ts
if elapsed_ms < 0 then
  elapsed_ms = 0
end

local refill = (elapsed_ms / 1000.0) * refill_per_sec
local new_tokens = current_tokens + refill
if new_tokens > capacity then
  new_tokens = capacity
end

local allowed = 0
local retry_after = 0
if new_tokens >= 1.0 then
  allowed = 1
  new_tokens = new_tokens - 1.0
else
  if refill_per_sec > 0 then
    retry_after = math.floor(((1.0 - new_tokens) / refill_per_sec) * 1000.0)
  else
    retry_after = 60000
  end
end

redis.call('HSET', key, 't', new_tokens)
redis.call('HSET', key, 'ts', now)
-- Keep the bucket from living forever if idle.
redis.call('PEXPIRE', key, 3600000)

local remaining_int = math.floor(new_tokens)
return tostring(allowed) .. '|' .. tostring(remaining_int) .. '|' .. tostring(retry_after)
