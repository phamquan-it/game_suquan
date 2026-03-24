'use client'

import { useEffect, useState } from 'react'
import { Button, Input, message } from 'antd'
import { supabase } from '@/utils/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (!access_token || !refresh_token) {
      message.error('Invalid or expired reset link')
      return
    }

    supabase.auth
      .setSession({
        access_token,
        refresh_token,
      })
      .then(({ error }) => {
        if (error) {
          message.error(error.message)
        } else {
          setReady(true)
        }
      })
  }, [])

  const onReset = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      message.error(error.message)
    } else {
      message.success('Password updated')
    }
  }

  if (!ready) return null

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2>Reset password</h2>
      <Input.Password
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="primary" block onClick={onReset} style={{ marginTop: 16 }}>
        Update password
      </Button>
    </div>
  )
}

