import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ROLE_LABELS, PERMISSIONS, ROLE_PERMISSIONS } from '../../lib/constants';
import { AppRole } from '../../types';
import { Shield, Check, X, ShieldAlert } from 'lucide-react';

export const RBACMatrixView: React.FC = () => {
  const { user, switchRole } = useAuth();
  const roles: AppRole[] = [
    'super_admin',
    'college_admin',
    'coordinator',
    'judge',
    'volunteer',
    'participant',
    'visitor',
  ];

  const permissionList = Object.values(PERMISSIONS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>Role-Based Access Control (RBAC) Matrix</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Enforced permissions across all Phase 1 modules for KalaTrack's 7 core user roles.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-300">Active Test Role:</span>
          <Badge variant="purple">{ROLE_LABELS[user?.system_role || 'visitor']?.title}</Badge>
        </div>
      </div>

      {/* Role Descriptions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((r) => {
          const info = ROLE_LABELS[r];
          const isActive = user?.system_role === r;
          return (
            <Card
              key={r}
              className={`transition-all ${
                isActive ? 'border-indigo-500/80 bg-indigo-500/5 ring-1 ring-indigo-500/30' : ''
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={isActive ? 'default' : 'zinc'} size="sm">
                    {info.title}
                  </Badge>
                  {isActive && <span className="text-[10px] text-indigo-400 font-bold uppercase">Current</span>}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{info.description}</p>
                <Button
                  size="sm"
                  variant={isActive ? 'secondary' : 'outline'}
                  className="w-full mt-2 text-xs"
                  onClick={() => switchRole(r)}
                >
                  {isActive ? 'Active Role' : `Switch to ${info.title}`}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Grant Matrix</CardTitle>
          <CardDescription>
            System privileges assigned per role in Phase 1 Foundation Platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission / Capability</TableHead>
                <TableHead>Category</TableHead>
                {roles.map((r) => (
                  <TableHead key={r} className="text-center font-bold">
                    <span className="text-[11px] whitespace-nowrap">{ROLE_LABELS[r].title.split(' ')[0]}</span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionList.map((perm) => (
                <TableRow key={perm.code}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-zinc-200 text-xs">{perm.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{perm.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-zinc-400 font-medium">{perm.category}</span>
                  </TableCell>
                  {roles.map((r) => {
                    const has = ROLE_PERMISSIONS[r]?.includes(perm.code);
                    return (
                      <TableCell key={r} className="text-center">
                        {has ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center mx-auto">
                            <X className="w-3 h-3" />
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
