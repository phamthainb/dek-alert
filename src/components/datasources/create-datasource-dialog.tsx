"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle } from "lucide-react"

export function CreateDataSourceDialog() {
  const [type, setType] = React.useState('');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Data Source
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Data Source</DialogTitle>
          <DialogDescription>
            Configure a new data source to be used in monitors.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Production PostgreSQL"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select onValueChange={setType}>
              <SelectTrigger className="col-span-3" id="type">
                <SelectValue placeholder="Select a data source type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elasticsearch">Elasticsearch</SelectItem>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="oracle">Oracle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'elasticsearch' && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="es-url" className="text-right">
                  URL
                </Label>
                <Input
                  id="es-url"
                  placeholder="https://my-cluster.es.cloud.io:9200"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="es-api-key" className="text-right">
                  API Key
                </Label>
                <Input
                  id="es-api-key"
                  type="password"
                  placeholder="Paste your API key"
                  className="col-span-3"
                />
              </div>
            </>
          )}

          {(type === 'postgresql' || type === 'mysql' || type === 'oracle') && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sql-host" className="text-right">
                  Host
                </Label>
                <Input
                  id="sql-host"
                  placeholder="db.example.com"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sql-port" className="text-right">
                  Port
                </Label>
                <Input
                  id="sql-port"
                  placeholder={type === 'postgresql' ? '5432' : type === 'mysql' ? '3306' : '1521'}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sql-user" className="text-right">
                  Username
                </Label>
                <Input
                  id="sql-user"
                  placeholder="admin"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sql-password" className="text-right">
                  Password
                </Label>
                <Input
                  id="sql-password"
                  type="password"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sql-database" className="text-right">
                  Database
                </Label>
                <Input
                  id="sql-database"
                  placeholder={type === 'oracle' ? 'Service Name / SID' : 'database_name'}
                  className="col-span-3"
                />
              </div>
            </>
          )}

        </div>
        <DialogFooter>
          <Button type="submit">Save Data Source</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}