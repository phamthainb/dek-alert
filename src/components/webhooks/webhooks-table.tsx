import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Webhook } from '@/lib/types';
import { MoreVertical, Pencil, Trash2, Link as LinkIcon, Code } from 'lucide-react';

const slackIcon = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMi41IDYuNWEyLjUgMi41IDAgMCAwLTIuNS0yLjVoLTFhMi41IDIuNSAwIDAgMCAwIDVoMVoiLz48cGF0aCBkPSJNMTcuNSA3LjVhMi41IDIuNSAwIDAgMCAyLjUgMi41djFoLTV2LTFhMi41IDIuNSAwIDAgMCAyLjUtMi41WiIvPjxwYXRoIGQ9Ik0xMS41IDE3LjVhMi41IDIuNSAwIDAgMC0yLjUgMi41aDFhMi41IDIuNSAwIDAgMCAwLTVoLTFaIi8+PHBhdGggZD0iTTYuNSAxNi41YTIuNSAyLjUgMCAwIDAgMi41LTIuNXYxSDVWMTZhMi41IDIuNSAwIDAgMCAyLjUtMi41WiIvPjxwYXRoIGQ9Ik0xNy41IDExLjVhMi41IDIuNSAwIDAgMC0yLjUgMi41djFoNVYxNGExLjUgMS41IDAgMCAwLTEuNS0yLjVIMTcuNVoiLz48cGF0aCBkPSJtNi41IDEyLjUgMi41LTIuNXYtMWgyLjV2MWExLjUgMS41IDAgMCAwIDEuNSAyLjVIMTQuNWEyLjUgMi4wIDAgMCAwLTIuNS0yLjVaIi8+PC9zdmc+`;
const discordIcon = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMyA3YTQgNCAwIDAgMC00IDRoMWExIDEgMCAwIDEtMSAxaDN2MWgtNHYyaDRhNCA0IDAgMCAwIDQtNGgtM2ExIDEgMCAwIDEtMS0xVjdoM3oiLz48cGF0aCBkPSJNOSAxN2E1IDUgMCAwIDAtNSA1aDEwYTUgNSAwIDAgMC01LTUiLz48L3N2Zz4=`;

const icons: Record<Webhook['platform'], React.ReactNode> = {
  Slack: <Image src={slackIcon} alt="Slack" width={20} height={20} />,
  Discord: <Image src={discordIcon} alt="Discord" width={20} height={20} />,
  Generic: <LinkIcon className="h-5 w-5 text-muted-foreground" />,
  Custom: <Code className="h-5 w-5 text-muted-foreground" />,
}

export function WebhooksTable({ webhooks }: { webhooks: Webhook[] }) {
  return (
    <Card className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Platform</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhooks.map((webhook) => (
            <TableRow key={webhook.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                    {icons[webhook.platform]}
                    <span className="text-sm font-medium">{webhook.platform}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{webhook.name}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-sm">
                {webhook.platform === 'Custom' ? 'Custom Script' : webhook.url}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/webhooks/${webhook.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
