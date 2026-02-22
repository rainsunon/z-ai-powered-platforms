'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Form, Input, Select, Radio, DatePicker, Button, message, Spin } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { addSmallLink, queryTitle } from '@/src/api'
import type { Group } from '@/src/api/types'
import { useDomain } from '@/src/store/useStore'
import styles from './CreateLink.module.css'

const { TextArea } = Input

interface CreateLinkProps {
  groupInfo: Group[]
  isSingle?: boolean // true for single, false for batch (but this is single component)
  defaultGid?: string
  onSubmit?: () => void
  onCancel?: () => void
}

/**
 * CreateLink Component - Single Link Creation
 * Converted from: views/mySpace/components/createLink/CreateLink.vue
 */
export default function CreateLink({
  groupInfo,
  isSingle = true,
  defaultGid,
  onSubmit,
  onCancel,
}: CreateLinkProps) {
  const [form] = Form.useForm()
  const { domain } = useDomain()
  const [validDateType, setValidDateType] = useState<number>(0) // 0 = permanent, 1 = custom
  const [isLoading, setIsLoading] = useState(false)
  const [originUrlRows, setOriginUrlRows] = useState(0)
  const [describeRows, setDescribeRows] = useState(0)
  const [submitDisabled, setSubmitDisabled] = useState(false)
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const maxRows = 100

  // URL validation regex (matches Vue)
  const urlRegex = /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+))(:\d+)?(\/.*)?(\?.*)?(#.*)?$/

  // Date shortcuts (matches Vue)
  const dateShortcuts = [
    {
      label: '1 Day',
      value: () => dayjs().add(1, 'day'),
    },
    {
      label: '7 Days',
      value: () => dayjs().add(7, 'days'),
    },
    {
      label: '30 Days',
      value: () => dayjs().add(30, 'days'),
    },
  ]

  // Initialize form with default group
  useEffect(() => {
    if (groupInfo.length > 0) {
      const initialGid = defaultGid || groupInfo[0].gid || null
      form.setFieldsValue({ gid: initialGid })
    }
  }, [groupInfo, defaultGid, form])

  // Watch originUrl for row count and auto-fetch title
  const handleOriginUrlChange = useCallback((value: string) => {
    const rows = (value || '').split(/\r|\r\n|\n/).length
    setOriginUrlRows(rows)

    // Auto-fetch title if describe is empty and URL is valid
    const describe = form.getFieldValue('describe')
    if (!describe && value && urlRegex.test(value)) {
      // Debounce the API call
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      
      debounceTimerRef.current = setTimeout(async () => {
        try {
          setIsLoading(true)
          const res = await queryTitle({ url: value })
          const responseData = res.data as any
          const title = responseData?.data || responseData?.data?.data
          if (title) {
            form.setFieldsValue({ describe: title })
            setDescribeRows((title || '').split(/\r|\r\n|\n/).length)
          }
        } catch (error) {
          // Silently fail - don't show error for auto-fetch
        } finally {
          setIsLoading(false)
        }
      }, 1000) // 1 second debounce
    }
  }, [form, urlRegex])

  // Watch describe for row count
  const handleDescribeChange = useCallback((value: string) => {
    const rows = (value || '').split(/\r|\r\n|\n/).length
    setDescribeRows(rows)
  }, [])

  // Disable past dates
  const disabledDate = (current: Dayjs | null) => {
    if (!current) return false
    return current.isBefore(dayjs(), 'day')
  }

  // Form submission
  const handleSubmit = async () => {
    setSubmitDisabled(true)
    try {
      const values = await form.validateFields()
      
      // Format domain: if it doesn't start with http:// or https://, add http://
      const formattedDomain = domain 
        ? (domain.startsWith('http://') || domain.startsWith('https://') 
            ? domain 
            : `http://${domain}`)
        : ''

      const formData = {
        originUrl: values.originUrl,
        describe: values.describe,
        gid: values.gid,
        createdType: 0, // 0 = manual creation via UI (matching Postman format)
        validDate: validDateType === 1 && values.validDate 
          ? values.validDate.format('YYYY-MM-DD HH:mm:ss')
          : null,
        validDateType: validDateType,
        domain: formattedDomain,
      }

      const res = await addSmallLink(formData)
      const responseData = res.data as any

      if (responseData?.success === false) {
        if (responseData?.code === 'A000001') {
          message.warning({
            content: responseData.message,
            duration: 5000,
          })
        } else {
          message.error(responseData.message || 'Create Failure!')
        }
        setSubmitDisabled(false)
      } else {
        message.success('Create Success!')
        form.resetFields()
        setValidDateType(0)
        setOriginUrlRows(0)
        setDescribeRows(0)
        onSubmit?.()
        setSubmitDisabled(false)
      }
    } catch (error: any) {
      if (error.errorFields) {
        // Validation errors - don't show message, form will show them
        setSubmitDisabled(false)
      } else {
        // Show detailed error message
        const errorMessage = error?.message || error?.response?.data?.message || 'Create Failure!'
        console.error('Create link error:', error)
        message.error(errorMessage)
        setSubmitDisabled(false)
      }
    }
  }

  // Cancel handler
  const handleCancel = () => {
    form.resetFields()
    setValidDateType(0)
    setOriginUrlRows(0)
    setDescribeRows(0)
    onCancel?.()
  }

  // Initialize form data (exposed for parent to call)
  const initFormData = useCallback(() => {
    form.resetFields()
    setValidDateType(0)
    setOriginUrlRows(0)
    setDescribeRows(0)
  }, [form])

  // Expose initFormData via useEffect (for parent component)
  useEffect(() => {
    // This allows parent to call initFormData if needed
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <div data-testid="component-create-link">
      <Form
        form={form}
        layout="vertical"
        labelCol={{ span: 6 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Redirect URL"
          name="originUrl"
          rules={[
            { required: true, message: 'Please enter URL' },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve()
                }
                
                const rows = value.split(/\r|\r\n|\n/)
                for (const row of rows) {
                  if (row && !urlRegex.test(row.trim())) {
                    return Promise.reject(new Error('Please enter a link starting with http:// or https:// or app redirect link'))
                  }
                }
                
                if (rows.length > maxRows) {
                  return Promise.reject(new Error(`Exceeds maximum ${maxRows} rows`))
                }
                
                setSubmitDisabled(false)
                return Promise.resolve()
              },
            },
          ]}
        >
          {isSingle ? (
            <Input
              data-testid="input-origin-url"
              placeholder="Please enter a link starting with http:// or https:// or app redirect link"
              onChange={(e) => handleOriginUrlChange(e.target.value)}
            />
          ) : (
            <TextArea
              data-testid="textarea-origin-url"
              rows={4}
              placeholder="Please enter links starting with http:// or https://, one per line, maximum 100 lines"
              onChange={(e) => handleOriginUrlChange(e.target.value)}
            />
          )}
        </Form.Item>

        <Form.Item
          label="Description"
          name="describe"
          extra={<span style={{ fontSize: '12px' }}>{`Will create ${describeRows} short link(s)`}</span>}
          rules={[
            { required: true, message: 'Please enter description' },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve()
                }
                
                const rows = value.split(/\r|\r\n|\n/).length
                
                if (!isSingle && rows !== originUrlRows) {
                  return Promise.reject(new Error('Title count does not match URL count'))
                }
                
                if (rows > maxRows) {
                  return Promise.reject(new Error(`Exceeds maximum ${maxRows} rows`))
                }
                
                return Promise.resolve()
              },
            },
          ]}
        >
          <Spin spinning={isLoading}>
            <TextArea
              data-testid="textarea-describe"
              rows={4}
              maxLength={100}
              showCount
              placeholder="Please enter description"
              onChange={(e) => handleDescribeChange(e.target.value)}
            />
          </Spin>
        </Form.Item>

        <Form.Item
          label="Group"
          name="gid"
          rules={[{ required: true, message: 'Please select a group' }]}
        >
          <Select
            data-testid="select-group"
            placeholder="Please select"
            options={groupInfo.map((group) => ({
              label: group.name || group.title,
              value: group.gid,
            }))}
          />
        </Form.Item>

        <Form.Item label="Validity Period" name="validDateType">
          <Radio.Group
            data-testid="radio-valid-date-type"
            value={validDateType}
            onChange={(e) => setValidDateType(e.target.value)}
          >
            <Radio value={0}>Permanent</Radio>
            <Radio value={1}>Custom</Radio>
          </Radio.Group>
        </Form.Item>

        {validDateType === 1 && (
          <Form.Item
            label="Select Date"
            name="validDate"
            rules={[{ required: false }]}
          >
            <DatePicker
              data-testid="date-picker-valid-date"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Select date"
              disabledDate={disabledDate}
              style={{ width: '100%' }}
              presets={dateShortcuts}
            />
            <span className={styles.alert}>Link will automatically redirect to 404 page after expiration!</span>
          </Form.Item>
        )}

        <Form.Item>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              data-testid="button-submit"
              type="primary"
              disabled={submitDisabled}
              onClick={handleSubmit}
              style={{ marginRight: '10px' }}
            >
              Confirm
            </Button>
            <Button
              data-testid="button-cancel"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

// Export initFormData for parent component use
export type { CreateLinkProps }
