import { NextResponse } from 'next/server'

// In development/test mode, only these numbers will work
const TEST_PHONE_NUMBERS = [
  '+1234567890', // Add your test phone numbers here
]

const isTestEnvironment = process.env.NODE_ENV !== 'production'

export async function POST(request: Request) {
  try {
    const { message, phoneNumber } = await request.json()

    if (!message || !phoneNumber) {
      return NextResponse.json(
        { error: 'Message and phone number are required' },
        { status: 400 }
      )
    }

    // Format phone number - remove any non-numeric characters and add '+' prefix
    const formattedPhone = '+' + phoneNumber.replace(/\D/g, '')

    // In test environment, check if the phone number is in the allowed list
    if (isTestEnvironment && !TEST_PHONE_NUMBERS.includes(formattedPhone)) {
      return NextResponse.json(
        { 
          error: 'In test mode, only registered test phone numbers are allowed. Please add your number to the WhatsApp test contact list at https://developers.facebook.com/docs/whatsapp/cloud-api/get-started',
          isTestError: true 
        },
        { status: 400 }
      )
    }

    const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: {
          body: message
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('WhatsApp API Error:', data)
      
      // Handle specific WhatsApp error codes
      if (data.error?.code === 131030) {
        return NextResponse.json({
          error: 'This phone number is not registered for testing. Please register it at https://developers.facebook.com/docs/whatsapp/cloud-api/get-started',
          isTestError: true
        }, { status: 400 })
      }

      return NextResponse.json(
        { error: data.error?.message || 'Failed to send WhatsApp message' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
