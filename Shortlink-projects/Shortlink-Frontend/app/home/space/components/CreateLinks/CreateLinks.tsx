'use client'

import { useState, useEffect, useCallback } from 'react'
import { Form, Input, Select, Radio, DatePicker, Button, message } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { addLinks } from '@/src/api'
import type { Group } from '@/src/api/types'
import { useDomain } from '@/src/store/useStore'
import styles from './CreateLinks.module.css'

const { TextArea } = Input

interface CreateLinksProps {
  groupInfo: Group[]
  defaultGid?: string
  onSubmit?: () => void
  onCancel?: () => void
}

/**
 * CreateLinks Component - Batch Link Creation
 * Converted from: views/mySpace/components/createLink/CreateLinks.vue
 */
export default function CreateLinks({
  groupInfo,
  defaultGid,
  onSubmit,
  onCancel,
}: CreateLinksProps) {
  const [form] = Form.useForm()
  const { domain } = useDomain()
  const [validDateType, setValidDateType] = useState<number>(0) // 0 = permanent, 1 = custom
  const [originUrlRows, setOriginUrlRows] = useState(0)
  const [describeRows, setDescribeRows] = useState(0)
  const [submitDisabled, setSubmitDisabled] = useState(false)
  
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

  // Watch originUrls for row count
  const handleOriginUrlsChange = useCallback((value: string) => {
    const rows = (value || '').split(/\r|\r\n|\n/).length
    setOriginUrlRows(rows)
  }, [])

  // Watch describes for row count
  const handleDescribesChange = useCallback((value: string) => {
    const rows = (value || '').split(/\r|\r\n|\n/).length
    setDescribeRows(rows)
  }, [])

  // Disable past dates
  const disabledDate = (current: Dayjs | null) => {
    if (!current) return false
    return current.isBefore(dayjs(), 'day')
  }

  // Convert string to array (split by newlines)
  const transferStrToArray = (str: string): string[] => {
    return str.split(/[\n]+/).filter(item => item.trim() !== '')
  }

  // Download Excel file
  const downloadXls = (res: any) => {
    try {
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      
      // Get filename from Content-Disposition header
      const contentDisposition = res.headers?.['content-disposition']
      let fileName = 'shortlinks.xlsx'
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ''))
        }
      }
      
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
      message.error('Failed to download file')
    }
  }

  // Form submission
  const handleSubmit = async () => {
    setSubmitDisabled(true)
    try {
      const values = await form.validateFields()
      
      const describes = transferStrToArray(values.describes)
      const originUrls = transferStrToArray(values.originUrls)

      // Format domain: if it doesn't start with http:// or https://, add http://
      const formattedDomain = domain 
        ? (domain.startsWith('http://') || domain.startsWith('https://') 
            ? domain 
            : `http://${domain}`)
        : ''

      const formData = {
        originUrls,
        describes,
        gid: values.gid,
        createdType: 0, // 0 = manual creation via UI (matching Postman format)
        validDate: validDateType === 1 && values.validDate 
          ? values.validDate.format('YYYY-MM-DD HH:mm:ss')
          : null,
        validDateType: validDateType,
        domain: formattedDomain,
      }

      const res = await addLinks(formData)
      
      // addLinks returns ArrayBuffer (Excel file), so we can directly use it
      if (res instanceof ArrayBuffer) {
        // Create a response-like object for downloadXls
        const mockResponse = {
          data: res,
          headers: {
            'content-disposition': 'attachment; filename*=UTF-8\'\'shortlinks.xlsx',
          },
        }
        message.success('Created successfully! Short link list download started')
        downloadXls(mockResponse)
        form.resetFields()
        setValidDateType(0)
        setOriginUrlRows(0)
        setDescribeRows(0)
        onSubmit?.()
        setSubmitDisabled(false)
      } else {
        // Handle other response formats (shouldn't happen, but just in case)
        const responseData = res as any
        if (!responseData?.success) {
          message.error(responseData?.message || 'Create failed')
          setSubmitDisabled(false)
        } else {
          message.success('Created successfully! Short link list download started')
          form.resetFields()
          setValidDateType(0)
          setOriginUrlRows(0)
          setDescribeRows(0)
          onSubmit?.()
          setSubmitDisabled(false)
        }
      }
    } catch (error: any) {
      if (error.errorFields) {
        // Validation errors - don't show message, form will show them
        setSubmitDisabled(false)
      } else {
        message.error('Create failed!')
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

  // Initialize form data
  const initFormData = useCallback(() => {
    form.resetFields()
    setValidDateType(0)
    setOriginUrlRows(0)
    setDescribeRows(0)
  }, [form])

  return (
    <div data-testid="component-create-links">
      <Form
        form={form}
        layout="vertical"
        labelCol={{ span: 6 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Redirect URLs"
          name="originUrls"
          extra={<span style={{ fontSize: '12px' }}>{`${originUrlRows}/${maxRows}`}</span>}
          rules={[
            { required: true, message: 'Please enter URLs' },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve()
                }
                
                const rows = value.split(/\r|\r\n|\n/)
                for (const row of rows) {
                  if (row.trim() && !urlRegex.test(row.trim())) {
                    return Promise.reject(new Error('Please enter links starting with http:// or https:// or app redirect links'))
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
          <TextArea
            data-testid="textarea-origin-urls"
            rows={4}
            placeholder="Please enter links starting with http:// or https://, one per line, maximum 100 lines"
            onChange={(e) => handleOriginUrlsChange(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Descriptions"
          name="describes"
          extra={<span style={{ fontSize: '12px' }}>{`${describeRows}/${maxRows}`}</span>}
          rules={[
            { required: true, message: 'Please enter descriptions' },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve()
                }
                
                const rows = value.split(/\r|\r\n|\n/)
                
                // Check for empty lines
                for (const row of rows) {
                  if (row.trim() === '') {
                    return Promise.reject(new Error('Please do not enter empty lines'))
                  }
                }
                
                if (rows.length !== originUrlRows) {
                  return Promise.reject(new Error('Description count does not match URL count'))
                }
                
                if (rows.length > maxRows) {
                  return Promise.reject(new Error(`Exceeds maximum ${maxRows} rows`))
                }
                
                return Promise.resolve()
              },
            },
          ]}
        >
          <TextArea
            data-testid="textarea-describes"
            rows={4}
            placeholder="Please enter descriptions, one per line, description rows should match URL rows"
            onChange={(e) => handleDescribesChange(e.target.value)}
          />
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

export type { CreateLinksProps }
