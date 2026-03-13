"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { apiCreateGenre } from "@/lib/api"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

type FormValues = {
  name: string
  description: string
}

export function AddGenreForm({ onAdded }: { onAdded: () => void }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onSubmit",
  })  
  const [loading, setLoading] = useState(false)

  async function onSubmit(values: FormValues) {
    setLoading(true)
    await apiCreateGenre({
      name: values.name,
      description: values.description,
    })
    reset()
    setLoading(false)
    onAdded()
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-lg font-medium">Add Genre</h2>
      <Controller
        name="name"
        control={control}
        rules={{ required: "Name is required" }}
        render={({ field }) => (
          <Input placeholder="Name" {...field} />
        )}
      />
      {errors.name && <div className="text-red-500">{errors.name.message}</div>}

      <Controller
        name="description"
        control={control}
        rules={{ required: "A description is required" }}
        render={({ field }) => (
          <Textarea placeholder="Description" {...field} />
        )}
      />
      {errors.description && <div className="text-red-500">{errors.description.message}</div>}

      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Genre"}
      </Button>
    </form>
  )
}