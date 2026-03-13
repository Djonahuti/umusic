"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { apiUpdateUser } from "@/lib/api"

interface EditUserFormProps {
  user: { id: string; fullName: string };
  onUpdated: () => void;
}

export function EditUserForm({ user, onUpdated }: EditUserFormProps) {
  const [name, setName] = useState(user.fullName)

  async function updateUser() {
    await apiUpdateUser({ id: user.id, fullName: name })
    onUpdated()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Edit User</h2>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={updateUser}>Save</Button>
    </div>
  )
}
