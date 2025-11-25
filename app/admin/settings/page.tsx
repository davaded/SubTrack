'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Save } from 'lucide-react'

interface SystemSettings {
  registrationMode: string
  siteName: string
  maxUsersLimit: number | null
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()

      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setSaved(false)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      const data = await res.json()

      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert(data.error?.message || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-headline">Settings</h1>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 bg-stroke rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-20 bg-stroke rounded" />
            <div className="h-20 bg-stroke rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-headline">Settings</h1>
        <Card>
          <CardContent className="py-12 text-center text-paragraph">
            Failed to load settings
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-headline">Settings</h1>
          <p className="text-paragraph mt-2">
            Configure system-wide settings
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="min-w-[120px]"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </>
          )}
        </Button>
      </div>

      {/* Registration Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Settings</CardTitle>
          <CardDescription>
            Control how new users can register for your service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Registration Mode</Label>
            <div className="grid gap-3">
              {[
                {
                  value: 'open',
                  label: 'Open Registration',
                  description: 'Users can register and are automatically activated',
                  color: 'border-green-500',
                },
                {
                  value: 'approval',
                  label: 'Approval Required',
                  description: 'Users can register but need admin approval to access',
                  color: 'border-yellow-500',
                },
                {
                  value: 'closed',
                  label: 'Registration Closed',
                  description: 'New user registration is completely disabled',
                  color: 'border-red-500',
                },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() =>
                    setSettings({ ...settings, registrationMode: mode.value })
                  }
                  className={`flex items-start gap-4 rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                    settings.registrationMode === mode.value
                      ? `${mode.color} bg-card-background`
                      : 'border-stroke bg-background hover:border-stroke/80'
                  }`}
                >
                  <div
                    className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      settings.registrationMode === mode.value
                        ? mode.color
                        : 'border-stroke'
                    }`}
                  >
                    {settings.registrationMode === mode.value && (
                      <div className={`h-3 w-3 rounded-full ${mode.color.replace('border-', 'bg-')}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-headline">{mode.label}</h3>
                    <p className="text-sm text-paragraph mt-1">
                      {mode.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Basic configuration for your SubTrack instance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              placeholder="SubTrack"
            />
            <p className="text-xs text-paragraph">
              The name displayed across your application
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUsers">Maximum Users Limit (Optional)</Label>
            <Input
              id="maxUsers"
              type="number"
              value={settings.maxUsersLimit || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxUsersLimit: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder="Leave empty for unlimited"
            />
            <p className="text-xs text-paragraph">
              Restrict the total number of users that can register. Leave empty for no limit.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between border-b border-stroke pb-2">
            <span className="text-paragraph">Registration Mode</span>
            <span className="font-semibold text-headline capitalize">
              {settings.registrationMode}
            </span>
          </div>
          <div className="flex justify-between border-b border-stroke pb-2">
            <span className="text-paragraph">Site Name</span>
            <span className="font-semibold text-headline">
              {settings.siteName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-paragraph">User Limit</span>
            <span className="font-semibold text-headline">
              {settings.maxUsersLimit || 'Unlimited'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
