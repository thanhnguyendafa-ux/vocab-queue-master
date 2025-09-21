'use client';
import { __awaiter, __generator } from "tslib";
import { useState } from 'react';
import { signOut } from '@/services/auth-service';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export function UserDropdown() {
    var _this = this;
    var _a = useState(false), open = _a[0], setOpen = _a[1];
    var user = useAuth().user;
    var router = useRouter();
    var handleSignOut = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, signOut()];
                case 1:
                    _a.sent();
                    router.push('/login');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to sign out', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    if (!user)
        return null;
    var getInitials = function (name) {
        return name
            .split(' ')
            .map(function (n) { return n[0]; })
            .join('')
            .toUpperCase();
    };
    return (<DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-full justify-between rounded-full p-0 pr-2">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              {user.photoURL ? (<AvatarImage src={user.photoURL} alt={user.displayName || ''}/>) : (<AvatarFallback className="bg-primary/10 text-primary">
                  {user.displayName ? getInitials(user.displayName) : 'U'}
                </AvatarFallback>)}
            </Avatar>
            <span className="ml-2 hidden md:block">
              {user.displayName || 'User'}
            </span>
          </div>
          <ChevronDown className={"ml-2 h-4 w-4 transition-transform ".concat(open ? 'rotate-180' : '')}/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={function () { return router.push('/profile'); }}>
            <User className="mr-2 h-4 w-4"/>
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={function () { return router.push('/settings'); }}>
            <Settings className="mr-2 h-4 w-4"/>
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4"/>
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>);
}
//# sourceMappingURL=user-dropdown.jsx.map