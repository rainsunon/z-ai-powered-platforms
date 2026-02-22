'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Form, Input, Select, Radio, DatePicker, Button, message, Spin } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { editSmallLink, queryTitle } from '@/src/api'
import type { Group, ShortLink } from '@/src/api/types'
import styles from './EditLink.module.css'

const { TextArea } = Input

interface EditLinkProps {
  groupInfo: Group[]
  editData: ShortLink
  onSubmit?: () => void
  onCancel?: () => void
  onUpdatePage?: () => void
}

/**
 * EditLink Component - Edit Existing Link
 * Converted from: views/mySpace/components/editLink/EditLink.vue
 */
export default function EditLink({
  groupInfo,
  editData,
  onSubmit,
  onCancel,
  onUpdatePage,
}: EditLinkProps) {
  const [form] = Form.useForm()
  const [validDateType, setValidDateType] = useState<number>(editData.validDateType ?? 0)
  const [isLoading, setIsLoading] = useState(false)
  const [originUrlRows, setOriginUrlRows] = useState(0)
  const [describeRows, setDescribeRows] = useState(0)
  
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

  // Initialize form with editData
  useEffect(() => {
    if (editData) {
      const initialValues = {
        originUrl: editData.originUrl || editData.originalUrl || '',
        describe: editData.describe || editData.title || '',
        gid: editData.gid || editData.groupId || null,
        validDate: editData.validDate ? dayjs(editData.validDate, 'YYYY-MM-DD HH:mm:ss') : null,
      }
      form.setFieldsValue(initialValues)
      setValidDateType(editData.validDateType ?? 0)
      
      // Calculate initial row counts
      setOriginUrlRows((initialValues.originUrl || '').split(/\r|\r\n|\n/).length)
      setDescribeRows((initialValues.describe || '').split(/\r|\r\n|\n/).length)
    }
  }, [editData, form])

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
    try {
      const values = await form.validateFields()
      
      const formData = {
        id: editData.id,
        fullShortUrl: editData.fullShortUrl,
        originUrl: values.originUrl,
        describe: values.describe,
        gid: values.gid,
        originGid: editData.gid, // Keep original group ID
        createdType: 1, // Default to 1 (manual creation)
        validDate: validDateType === 1 && values.validDate 
          ? values.validDate.format('YYYY-MM-DD HH:mm:ss')
          : null,
        validDateType: validDateType,
        domain: editData.domain || '',
      }

      const res = await editSmallLink(formData)
      const responseData = res.data as any

      if (responseData?.code !== '0' && responseData?.success === false) {
        message.error(responseData.message || 'Update failed')
      } else {
        message.success('Update successful')
        form.resetFields()
        onSubmit?.()
        onUpdatePage?.()
      }
    } catch (error: any) {
      if (error.errorFields) {
        // Validation errors - don't show message, form will show them
      } else {
        message.error('Update failed')
      }
    }
  }

  // Cancel handler
  const handleCancel = () => {
    form.resetFields()
    onCancel?.()
  }

  // Initialize form data (exposed for parent to call)
  const initFormData = useCallback(() => {
    form.resetFields()
    setValidDateType(0)
    setOriginUrlRows(0)
    setDescribeRows(0)
  }, [form])

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <div data-testid="component-edit-link">
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
                
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input
            data-testid="input-origin-url"
            placeholder="Please enter a link starting with http:// or https:// or app redirect link"
            onChange={(e) => handleOriginUrlChange(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="describe"
          extra={<span style={{ fontSize: '12px' }}>{`${describeRows}/${maxRows}`}</span>}
          rules={[
            { required: true, message: 'Please enter description' },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve()
                }
                
                const rows = value.split(/\r|\r\n|\n/).length
                
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
              placeholder="You can create multiple short links by line breaks, one per line, maximum 50 per batch"
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
export type { EditLinkProps }
