'use client'

import { useState, useEffect } from 'react'
import { Descriptions, Button, Modal, Form, Input, message } from 'antd'
import { UserOutlined, PhoneOutlined, IdcardOutlined, MailOutlined } from '@ant-design/icons'
import { queryUserInfo, editUser } from '@/src/api'
import { getUsername } from '@/src/lib/auth'
import type { User } from '@/src/api/types'
import styles from './account.module.css'

/**
 * Account/User Settings Page
 * Route: /home/account
 * Matches Vue: views/mine/MineIndex.vue
 */
export default function AccountPage() {
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [form] = Form.useForm()

  // Load user info
  const loadUserInfo = async () => {
    setLoading(true)
    try {
      const username = getUsername()
      if (!username) {
        message.error('User not logged in')
        return
      }

      const res = await queryUserInfo(username)
      const responseData = res.data as any
      const user = responseData.data || responseData
      setUserInfo(user)
      
      // Set form initial values
      form.setFieldsValue({
        username: user.username,
        mail: user.mail || user.email,
        phone: user.phone,
        realName: user.realName,
        password: '', // Don't pre-fill password
      })
    } catch (error: any) {
      message.error(error.message || 'Failed to load user info')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserInfo()
  }, [])

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      // Only include password if it's provided
      const updateData: Partial<User> = {
        username: values.username,
        mail: values.mail,
        phone: values.phone,
        realName: values.realName,
      }
      
      if (values.password && values.password.trim()) {
        updateData.password = values.password
      }

      const res = await editUser(updateData)
      const responseData = res.data as any
      
      if (responseData?.code === '0' || responseData?.success !== false) {
        message.success('Profile updated successfully!')
        setDialogVisible(false)
        await loadUserInfo()
      } else {
        message.error(responseData?.message || 'Failed to update profile')
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update profile'
      message.error(errorMsg)
    }
  }

  // Handle modal close
  const handleClose = () => {
    form.resetFields()
    setDialogVisible(false)
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div>
          <span>Account Settings</span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainBox}>
        <Descriptions
          title="Personal Information"
          bordered
          column={1}
          className={styles.contentBox}
        >
          <Descriptions.Item
            label={
              <div className={styles.cellItem}>
                <UserOutlined style={{ marginRight: '8px' }} />
                Username
              </div>
            }
          >
            {userInfo?.username || '-'}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <div className={styles.cellItem}>
                <PhoneOutlined style={{ marginRight: '8px' }} />
                Phone
              </div>
            }
          >
            {userInfo?.phone || '-'}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <div className={styles.cellItem}>
                <IdcardOutlined style={{ marginRight: '8px' }} />
                Real Name
              </div>
            }
          >
            {userInfo?.realName || '-'}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <div className={styles.cellItem}>
                <MailOutlined style={{ marginRight: '8px' }} />
                Email
              </div>
            }
          >
            {userInfo?.mail || userInfo?.email || '-'}
          </Descriptions.Item>
        </Descriptions>

        <Button
          type="primary"
          className={styles.editButton}
          onClick={() => setDialogVisible(true)}
        >
          Edit Profile
        </Button>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Profile"
        open={dialogVisible}
        onCancel={handleClose}
        footer={null}
        width="60%"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.formContainer}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input
              placeholder="Enter username"
              maxLength={11}
              showCount
              disabled
              addonBefore="Username"
            />
          </Form.Item>

          <Form.Item
            name="mail"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              {
                pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                message: 'Please enter a valid email address',
              },
            ]}
          >
            <Input
              placeholder="Enter email"
              showCount
              allowClear
              addonBefore="Email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please enter phone number' },
              {
                pattern: /^1[3|5|7|8|9]\d{9}$/,
                message: 'Please enter a valid phone number',
              },
              { len: 11, message: 'Phone number must be 11 digits' },
            ]}
          >
            <Input
              placeholder="Enter phone number"
              showCount
              allowClear
              maxLength={11}
              addonBefore="Phone"
            />
          </Form.Item>

          <Form.Item
            name="realName"
            label="Real Name"
            rules={[{ required: true, message: 'Please enter real name' }]}
          >
            <Input
              placeholder="Enter real name"
              showCount
              allowClear
              addonBefore="Name"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: false },
              { min: 8, max: 15, message: 'Password must be 8-15 characters' },
            ]}
            help="Leave blank to keep current password"
          >
            <Input.Password
              placeholder="Enter new password (optional)"
              showCount
              allowClear
              addonBefore="Password"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
