import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare, Phone, Settings } from 'lucide-react';

interface NotificationSetting {
  id: string;
  type: string;
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  description: string;
}

interface NotificationLog {
  id: string;
  type: string;
  recipient: string;
  status: 'sent' | 'failed';
  timestamp: string;
  message: string;
}

const Notifications: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      type: 'email',
      enabled: true,
      frequency: 'weekly',
      description: 'Email notifications for upcoming fee payments'
    },
    {
      id: '2',
      type: 'sms',
      enabled: true,
      frequency: 'monthly',
      description: 'SMS reminders for due payments'
    },
    {
      id: '3',
      type: 'whatsapp',
      enabled: false,
      frequency: 'daily',
      description: 'WhatsApp notifications for payment updates'
    }
  ]);

  const [notificationLogs] = useState<NotificationLog[]>([
    {
      id: '1',
      type: 'email',
      recipient: 'student@example.com',
      status: 'sent',
      timestamp: '2024-02-22 10:30 AM',
      message: 'Fee payment reminder for March 2024'
    },
    {
      id: '2',
      type: 'sms',
      recipient: '+1234567890',
      status: 'sent',
      timestamp: '2024-02-21 02:15 PM',
      message: 'Your fee payment is due in 5 days'
    }
  ]);

  const toggleNotification = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'sms':
        return <MessageSquare className="h-5 w-5" />;
      case 'whatsapp':
        return <Phone className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Notification Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Configure how and when you want to receive fee-related notifications
            </p>
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure Global Settings
          </Button>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
          <ul className="divide-y divide-gray-200">
            {settings.map((setting) => (
              <li key={setting.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getNotificationIcon(setting.type)}
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 capitalize">
                          {setting.type} Notifications
                        </h3>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-sm text-gray-500 capitalize">
                        {setting.frequency}
                      </span>
                      <Button
                        variant={setting.enabled ? "default" : "outline"}
                        onClick={() => toggleNotification(setting.id)}
                      >
                        {setting.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Notification Logs */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Notifications</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {notificationLogs.map((log) => (
                <li key={log.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getNotificationIcon(log.type)}
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{log.message}</p>
                          <p className="text-sm text-gray-500">
                            Sent to: {log.recipient}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;