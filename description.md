- **Next.js (App Router)**
- **TypeScript**
- **TailwindCSS**
- **TanStack Query**
- **react-icons**
- Backend already ready
- Feature-based architecture
- Clean UI system
- Google Maps integration
- Balance-based payments
- Uzbekistan regions data

---

# 🚗 Project Overview

We are building a **ride-sharing platform (similar to BlaBlaCar)** where:

- Users can register/login
- Users can search rides (From → To → Date → Passengers)
- Users have internal **balance**
- Balance can be topped up using saved cards
- Ride payments are deducted from balance only
- Google Maps is used for route visualization
- Regions are limited to **Uzbekistan regions**

---

# 🏗️ Tech Stack

### Core

- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- TanStack Query (API state management)
- Axios (API client)
- react-icons
- Google Maps JS SDK

### UI Strategy

- Custom reusable components
- Clean design system
- Modern typography
- Beautiful soft color palette
- Responsive (mobile-first)

---

# 📁 Folder Structure

We follow **feature-based architecture**.

```
/app
  layout.tsx
  page.tsx
  not-found.tsx

  /auth
    /login
      page.tsx
    /register
      page.tsx
    /verify
      page.tsx

  /dashboard
    page.tsx

  /rides
    page.tsx
    /[id]
      page.tsx

/src
  /components
    /ui
      Button.tsx
      Input.tsx
      Dropdown.tsx
      Modal.tsx
      Radio.tsx
      Checkbox.tsx
      Loader.tsx
    Navbar.tsx
    Footer.tsx
    NotFound.tsx

  /features
    /auth
      components/
      hooks/
      actions/
      types/

    /rides
      components/
      hooks/
      actions/
      types/

    /dashboard
      components/
      hooks/
      actions/
      types/

    /balance
      components/
      hooks/
      actions/
      types/

    /maps
      components/
      hooks/
      types/

  /lib
    api.ts
    axios.ts
    utils.ts
    constants.ts
    regions.ts

  /types
    global.ts
```

---

# 🎨 Design System

## Fonts

Use modern, premium fonts:

- **Heading:** Inter / Manrope
- **Body:** Inter

From Google Fonts.

---

## 🎨 Color Palette (Soft & Modern)

```
Primary:     #4F46E5 (Indigo)
Primary Dark:#4338CA
Secondary:   #0EA5E9 (Sky Blue)
Accent:      #F59E0B (Amber)
Success:     #10B981
Error:       #EF4444
Dark Text:   #0F172A
Light BG:    #F8FAFC
Card BG:     #FFFFFF
Border:      #E2E8F0
```

Design style:

- Rounded-2xl cards
- Soft shadows
- Smooth transitions
- Large spacing
- Clean minimal layout

---

# 🔘 Reusable UI Components

Located in:

```
/src/components/ui
```

### 1️⃣ Button

Variants:

- primary
- secondary
- outline
- ghost
- danger

Props:

```
variant
size (sm, md, lg)
loading
icon
fullWidth
```

---

### 2️⃣ Input

Props:

```
label
error
iconLeft
iconRight
type
```

---

### 3️⃣ Dropdown

Used for:

- Regions
- Passenger count
- Card selection

---

### 4️⃣ Modal

Reusable modal for:

- Add card
- Confirm payment
- Top up balance

---

### 5️⃣ Radio

Used for:

- Payment method
- Gender (future)
- Preferences

---

### 6️⃣ Checkbox

Used for:

- Accept terms
- Remember me

---

### 7️⃣ Loader

- Full page loader
- Button loader
- Section loader

---

# 🔐 Authentication Feature

## 📁 /features/auth

### Types

```
User
RegisterPayload
LoginPayload
VerifyPayload
```

---

## 📝 Registration Flow

### Fields:

- First Name
- Last Name
- Father's Name
- Email
- Password
- Confirm Password

Validation:

- Password min 8
- Confirm must match
- Email valid format

After submit:
→ Backend sends 4-digit code (mock)
→ Redirect to `/auth/verify`

---

## 🔢 Verify Page

Input:

- 4 digit code

For now:

- Accept ANY 4 digits (test mode)

Later:

- Real email or SMS confirmation

---

## 🔓 Login

Fields:

- Email
- Password

After login:

- Save JWT (HTTP-only cookie preferred)
- Redirect to dashboard

---

# 🏠 Landing Page (Main Page)

## Hero Section

Search form with:

- Leaving From (Dropdown of Uzbekistan regions)
- Going To (Dropdown)
- Date Picker
- Passenger Count (Dropdown 1–4)
- Search Button

---

## Below Hero:

### About Service Section

Explain:

- Safe rides
- Affordable prices
- Verified drivers
- Easy balance payment

With icons from `react-icons`.

---

# 🗺️ Uzbekistan Regions Data

Create:

```
/src/lib/regions.ts
```

Data:

```
Tashkent
Tashkent Region
Samarkand
Bukhara
Khorezm
Fergana
Andijan
Namangan
Navoi
Jizzakh
Syrdarya
Kashkadarya
Surkhandarya
Karakalpakstan
```

Format:

```
{
  id: string
  name: string
  lat: number
  lng: number
}
```

---

# 🚘 Rides Feature

## Search Rides

API:

```
GET /rides?from=&to=&date=&passengers=
```

Display:

- Driver avatar
- Driver name
- Car model
- Available seats
- Price
- Departure time
- Rating

---

## Ride Details Page

- Full route on Google Maps
- Driver info
- Car info
- Seats left
- Pay button

---

# 💳 Balance System

## User Has:

```
balance: number
cards: Card[]
```

---

## Top Up Balance

Flow:

1. Add card
2. Select card
3. Enter amount
4. Confirm
5. Balance updated

---

## Pay for Ride

- Check if balance >= ride price
- Deduct from balance
- Confirm booking

Payment allowed ONLY from balance.

---

# 🗺️ Google Maps Integration

Feature folder:

```
/features/maps
```

Use:

- @react-google-maps/api

Show:

- From marker
- To marker
- Route line
- Estimated distance

---

# 📊 Dashboard

User Dashboard:

Sections:

- My rides
- My balance
- My cards
- Profile settings

---

# 🌐 Global Components

## Navbar

- Logo
- Search
- Balance indicator
- Profile dropdown
- Login/Register (if not auth)

---

## Footer

- About
- Contact
- Terms
- Social links

---

## Not Found

Custom 404 page.

---

# ⚡ State Management

Use:

### TanStack Query

For:

- All API calls
- Caching
- Refetching

### Local State

- UI states
- Modal open/close

---

# 🔐 Security

- Use HTTP-only cookies for token
- Protect dashboard routes
- Middleware for auth redirect

---

# 📱 Responsive

Mobile first:

- Collapsible navbar
- Full-width search
- Cards stacked vertically

---

# 🚀 Future Improvements

- Real SMS verification
- Driver role
- Reviews system
- Push notifications
- Real-time chat
- Stripe integration
- Admin panel

---

# 🧠 Development Rules

1. Never place large logic in app routes.
2. Business logic → features folder.
3. UI reusable → components/ui.
4. All API calls → feature/actions.
5. All types → feature/types.
6. Strict TypeScript.
7. Clean naming.
