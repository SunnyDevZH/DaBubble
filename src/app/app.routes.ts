import { Routes } from '@angular/router';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { MainContentComponent } from './main-content/main-content.component';
import { RegisterComponent } from './main-content/auth/register/register.component';
import { LogInComponent } from './main-content/auth/log-in/log-in.component';
import { AddChannelComponent } from './main-content/channel/add-channel/add-channel.component';
import { ChannelComponent } from './main-content/channel/channel.component';
import { IsAdminGuard } from './shared/services/authguard.service';
import { SendEmailComponent } from './main-content/auth/send-email/send-email.component';
import { ResetPasswordComponent } from './main-content/auth/reset-password/reset-password.component';
import { NewMessageComponent } from './main-content/new-message/new-message.component';
import { ChannelEditionComponent } from './main-content/channel/channel-edition/channel-edition.component';
import { ChooseAvatarComponent } from './main-content/auth/register/choose-avatar/choose-avatar.component';
import { ThreadComponent } from './shared/components/thread/thread.component';
import { DirectMessageComponent } from './main-content/direct-message/direct-message.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'main', component: MainContentComponent, canActivate:[IsAdminGuard] },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'add-channel', component: AddChannelComponent, canActivate:[IsAdminGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'choose-avatar', component: ChooseAvatarComponent },
  { path: 'login', component: LogInComponent },
  { path: 'send-email', component: SendEmailComponent },
  { path: 'reset-password', component: ResetPasswordComponent },  
  { path: 'channel/:id', component: ChannelComponent, canActivate:[IsAdminGuard] },  
  { path: 'direct-message/:id', component: DirectMessageComponent, canActivate:[IsAdminGuard] },
  { path: 'new-message', component: NewMessageComponent, canActivate:[IsAdminGuard]},
  { path: 'channel-edition/:id', component: ChannelEditionComponent, canActivate:[IsAdminGuard]},  
  { path: 'thread', component: ThreadComponent, canActivate:[IsAdminGuard]},
  { path: '**', redirectTo: '/login', pathMatch: 'full' },

  // { path: 'newchannel', component: NewChannelComponent, canActivate:[IsAdminGuard]},  
];
