import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AIEmployeesService } from '../../../workspaces/ai-employees/ai-employees.service';
import { WorkspacesService } from '../../../workspaces/workspaces.service';

const SETTINGS_ICON = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.0168 13.7322C16.9656 13.7322 15.9813 14.14 15.2359 14.8854C14.4941 15.6307 14.0828 16.615 14.0828 17.6662C14.0828 18.7174 14.4941 19.7018 15.2359 20.4471C15.9813 21.1889 16.9656 21.6002 18.0168 21.6002C19.068 21.6002 20.0523 21.1889 20.7977 20.4471C21.5395 19.7018 21.9508 18.7174 21.9508 17.6662C21.9508 16.615 21.5395 15.6307 20.7977 14.8854C20.4336 14.5185 20.0003 14.2277 19.5229 14.0297C19.0456 13.8318 18.5336 13.7306 18.0168 13.7322ZM32.5117 22.0115L30.2125 20.0463C30.3215 19.3783 30.3777 18.6963 30.3777 18.0178C30.3777 17.3393 30.3215 16.6537 30.2125 15.9893L32.5117 14.024C32.6854 13.8753 32.8097 13.6773 32.8681 13.4562C32.9265 13.2352 32.9162 13.0016 32.8387 12.7865L32.807 12.6951C32.1743 10.9257 31.2261 9.28551 30.0086 7.8541L29.9453 7.78027C29.7975 7.60643 29.6004 7.48147 29.3801 7.42185C29.1598 7.36223 28.9267 7.37075 28.7113 7.44629L25.8566 8.4623C24.802 7.59746 23.6277 6.91543 22.3551 6.44082L21.8031 3.45605C21.7615 3.2312 21.6524 3.02434 21.4904 2.86296C21.3284 2.70158 21.1211 2.59331 20.8961 2.55254L20.8012 2.53496C18.973 2.20449 17.0465 2.20449 15.2184 2.53496L15.1234 2.55254C14.8984 2.59331 14.6911 2.70158 14.5291 2.86296C14.3671 3.02434 14.2581 3.2312 14.2164 3.45605L13.6609 6.45488C12.4003 6.93328 11.226 7.61365 10.184 8.46934L7.30821 7.44629C7.09293 7.37015 6.85958 7.36132 6.63917 7.42098C6.41875 7.48063 6.22171 7.60595 6.07422 7.78027L6.01094 7.8541C4.79556 9.28704 3.84768 10.9268 3.2125 12.6951L3.18086 12.7865C3.02266 13.226 3.15274 13.7182 3.50782 14.024L5.83516 16.0104C5.72618 16.6713 5.67344 17.3463 5.67344 18.0143C5.67344 18.6893 5.72618 19.3643 5.83516 20.0182L3.51485 22.0045C3.34116 22.1532 3.21685 22.3512 3.15845 22.5723C3.10005 22.7933 3.11032 23.0269 3.1879 23.242L3.21954 23.3334C3.85586 25.1018 4.79454 26.7365 6.01797 28.1744L6.08125 28.2482C6.2291 28.4221 6.42615 28.547 6.64643 28.6067C6.86672 28.6663 7.0999 28.6578 7.31524 28.5822L10.191 27.5592C11.2387 28.4205 12.4059 29.1025 13.668 29.5736L14.2234 32.5725C14.2651 32.7973 14.3742 33.0042 14.5362 33.1656C14.6982 33.3269 14.9055 33.4352 15.1305 33.476L15.2254 33.4936C17.0715 33.8258 18.9621 33.8258 20.8082 33.4936L20.9031 33.476C21.1281 33.4352 21.3354 33.3269 21.4974 33.1656C21.6594 33.0042 21.7685 32.7973 21.8102 32.5725L22.3621 29.5877C23.6348 29.1096 24.809 28.4311 25.8637 27.5662L28.7184 28.5822C28.9336 28.6584 29.167 28.6672 29.3874 28.6075C29.6078 28.5479 29.8049 28.4226 29.9523 28.2482L30.0156 28.1744C31.2391 26.7295 32.1777 25.1018 32.8141 23.3334L32.8457 23.242C32.9969 22.8061 32.8668 22.3174 32.5117 22.0115ZM18.0168 23.8467C14.6031 23.8467 11.8363 21.0799 11.8363 17.6662C11.8363 14.2525 14.6031 11.4857 18.0168 11.4857C21.4305 11.4857 24.1973 14.2525 24.1973 17.6662C24.1973 21.0799 21.4305 23.8467 18.0168 23.8467Z" fill="black" fill-opacity="0.85"/></svg>`;
const DASHBOARD_ICON = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.5125 13.5563C31.7219 11.6849 30.5757 9.98475 29.1375 8.55C27.7028 7.11179 26.0026 5.96561 24.1313 5.175C22.1871 4.35234 20.127 3.9375 18 3.9375C15.873 3.9375 13.8129 4.35234 11.8688 5.175C9.99741 5.96561 8.29725 7.11179 6.8625 8.55C5.42429 9.98475 4.27811 11.6849 3.4875 13.5563C2.66484 15.5004 2.25 17.5605 2.25 19.6875C2.25 24.3527 4.29961 28.7473 7.87148 31.7496L7.93125 31.7988C8.13516 31.9676 8.3918 32.0625 8.65547 32.0625H27.348C27.6117 32.0625 27.8684 31.9676 28.0723 31.7988L28.132 31.7496C31.7004 28.7473 33.75 24.3527 33.75 19.6875C33.75 17.5605 33.3316 15.5004 32.5125 13.5563ZM16.9453 8.15625C16.9453 8.00156 17.0719 7.875 17.2266 7.875H18.7734C18.9281 7.875 19.0547 8.00156 19.0547 8.15625V10.9688C19.0547 11.1234 18.9281 11.25 18.7734 11.25H17.2266C17.0719 11.25 16.9453 11.1234 16.9453 10.9688V8.15625ZM9.49219 20.4609C9.49219 20.6156 9.36562 20.7422 9.21094 20.7422H6.39844C6.24375 20.7422 6.11719 20.6156 6.11719 20.4609V18.9141C6.11719 18.7594 6.24375 18.6328 6.39844 18.6328H9.21094C9.36562 18.6328 9.49219 18.7594 9.49219 18.9141V20.4609ZM12.6809 13.2715L11.5875 14.3648C11.5346 14.4172 11.4633 14.4465 11.3889 14.4465C11.3145 14.4465 11.2431 14.4172 11.1902 14.3648L9.20039 12.375C9.14805 12.3221 9.11869 12.2508 9.11869 12.1764C9.11869 12.102 9.14805 12.0306 9.20039 11.9777L10.2937 10.8844C10.4027 10.7754 10.582 10.7754 10.691 10.8844L12.6809 12.8742C12.7898 12.9832 12.7898 13.1625 12.6809 13.2715ZM22.9148 16.2105L19.9441 19.1812C20.1199 19.8387 19.9512 20.5664 19.4344 21.0832C19.2517 21.2663 19.0347 21.4115 18.7958 21.5106C18.5569 21.6096 18.3008 21.6606 18.0422 21.6606C17.7836 21.6606 17.5275 21.6096 17.2886 21.5106C17.0497 21.4115 16.8327 21.2663 16.65 21.0832C16.467 20.9005 16.3217 20.6835 16.2227 20.4446C16.1236 20.2057 16.0726 19.9496 16.0726 19.691C16.0726 19.4324 16.1236 19.1763 16.2227 18.9374C16.3217 18.6985 16.467 18.4815 16.65 18.2988C16.8941 18.054 17.1985 17.8779 17.5325 17.7884C17.8664 17.6989 18.2181 17.6991 18.552 17.7891L21.5227 14.8184C21.6316 14.7094 21.8109 14.7094 21.9199 14.8184L22.9148 15.8133C23.0238 15.9223 23.0238 16.098 22.9148 16.2105ZM24.4266 14.3684L23.3332 13.275C23.2809 13.2221 23.2515 13.1508 23.2515 13.0764C23.2515 13.002 23.2809 12.9306 23.3332 12.8777L25.323 10.8879C25.432 10.7789 25.6113 10.7789 25.7203 10.8879L26.8137 11.9812C26.9227 12.0902 26.9227 12.2695 26.8137 12.3785L24.8238 14.3684C24.771 14.4207 24.6996 14.4501 24.6252 14.4501C24.5508 14.4501 24.4794 14.4207 24.4266 14.3684ZM29.7422 20.4609C29.7422 20.6156 29.6156 20.7422 29.4609 20.7422H26.6484C26.4937 20.7422 26.3672 20.6156 26.3672 20.4609V18.9141C26.3672 18.7594 26.4937 18.6328 26.6484 18.6328H29.4609C29.6156 18.6328 29.7422 18.7594 29.7422 18.9141V20.4609Z" fill="black" fill-opacity="0.85"/></svg>`
const ROBOT_ICON = `<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"> <g id="wrapper" clip-path="url(#clip0_180399_3340)"> <path id="Union" d="M11.6484 0.875305H2.35156C2.10957 0.875305 1.91406 1.07081 1.91406 1.31281V10.3362C1.91406 10.5782 2.10957 10.7737 2.35156 10.7737H11.6484C11.8904 10.7737 12.0859 10.5782 12.0859 10.3362V1.31281C12.0859 1.07081 11.8904 0.875305 11.6484 0.875305ZM4.10156 4.48468C4.10156 4.03214 4.46934 3.66437 4.92188 3.66437C5.37441 3.66437 5.74219 4.03214 5.74219 4.48468C5.74219 4.93722 5.37441 5.30499 4.92188 5.30499C4.46934 5.30499 4.10156 4.93722 4.10156 4.48468ZM9.1875 7.87531C9.1875 7.93546 9.13828 7.98468 9.07812 7.98468C9.07812 7.98468 7.81467 8.16697 7 8.16697C6.18533 8.16697 4.92188 7.98468 4.92188 7.98468C4.86172 7.98468 4.8125 7.93546 4.8125 7.87531V7.05499C4.8125 6.99484 4.86172 6.94562 4.92188 6.94562C4.92188 6.94562 6.18263 7.19475 7 7.19475C7.81737 7.19475 9.07812 6.94562 9.07812 6.94562C9.13828 6.94562 9.1875 6.99484 9.1875 7.05499V7.87531ZM9.07812 5.30499C8.62559 5.30499 8.25781 4.93722 8.25781 4.48468C8.25781 4.03214 8.62559 3.66437 9.07812 3.66437C9.53066 3.66437 9.89844 4.03214 9.89844 4.48468C9.89844 4.93722 9.53066 5.30499 9.07812 5.30499ZM10.9238 11.8128H3.07617C2.8875 11.8128 2.73438 12.0083 2.73438 12.2503V13.0159C2.73438 13.0761 2.77266 13.1253 2.81914 13.1253H11.1795C11.226 13.1253 11.2643 13.0761 11.2643 13.0159V12.2503C11.2656 12.0083 11.1125 11.8128 10.9238 11.8128Z" /> </g> <defs> <clipPath id="clip0_180399_3340"> <rect width="14" height="14" fill="white"/> </clipPath> </defs> </svg> `
const CLOCK_ICON = `<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"> <g id="wrapper" clip-path="url(#clip0_180461_3156)"> <path id="Union" d="M7 0.875366C3.61758 0.875366 0.875 3.61794 0.875 7.00037C0.875 10.3828 3.61758 13.1254 7 13.1254C10.3824 13.1254 13.125 10.3828 13.125 7.00037C13.125 3.61794 10.3824 0.875366 7 0.875366ZM9.41309 8.88298L9.02207 9.41619C9.01357 9.4278 9.00285 9.43761 8.99054 9.44507C8.97823 9.45253 8.96457 9.45747 8.95034 9.45963C8.93611 9.46179 8.92159 9.46112 8.90763 9.45765C8.89366 9.45419 8.88051 9.44799 8.86895 9.43943L6.60762 7.7906C6.59353 7.78048 6.58208 7.76713 6.57423 7.75167C6.56638 7.7362 6.56235 7.71908 6.5625 7.70173V3.93787C6.5625 3.87771 6.61172 3.82849 6.67188 3.82849H7.32949C7.38965 3.82849 7.43887 3.87771 7.43887 3.93787V7.32166L9.38848 8.73123C9.4377 8.7654 9.44863 8.83377 9.41309 8.88298Z" /> </g> <defs> <clipPath id="clip0_180461_3156"> <rect width="14" height="14" fill="white" transform="translate(0 0.000244141)"/> </clipPath> </defs> </svg> `
const DATABASE_ICON = `<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"> <g id="wrapper" clip-path="url(#clip0_180461_4507)"> <path id="Union" d="M11.375 0.875366H2.625C2.38301 0.875366 2.1875 1.07087 2.1875 1.31287V4.37537H11.8125V1.31287C11.8125 1.07087 11.617 0.875366 11.375 0.875366ZM3.9375 3.17224C3.63535 3.17224 3.39062 2.92751 3.39062 2.62537C3.39062 2.32322 3.63535 2.07849 3.9375 2.07849C4.23965 2.07849 4.48438 2.32322 4.48438 2.62537C4.48438 2.92751 4.23965 3.17224 3.9375 3.17224ZM2.1875 12.6879C2.1875 12.9299 2.38301 13.1254 2.625 13.1254H11.375C11.617 13.1254 11.8125 12.9299 11.8125 12.6879V9.62537H2.1875V12.6879ZM3.9375 10.8285C4.23965 10.8285 4.48438 11.0732 4.48438 11.3754C4.48438 11.6775 4.23965 11.9222 3.9375 11.9222C3.63535 11.9222 3.39062 11.6775 3.39062 11.3754C3.39062 11.0732 3.63535 10.8285 3.9375 10.8285ZM2.1875 8.75037H11.8125V5.25037H2.1875V8.75037ZM3.9375 6.45349C4.23965 6.45349 4.48438 6.69822 4.48438 7.00037C4.48438 7.30251 4.23965 7.54724 3.9375 7.54724C3.63535 7.54724 3.39062 7.30251 3.39062 7.00037C3.39062 6.69822 3.63535 6.45349 3.9375 6.45349Z" /> </g> <defs> <clipPath id="clip0_180461_4507"> <rect width="14" height="14" fill="white" transform="translate(0 0.000244141)"/> </clipPath> </defs> </svg> `
const UNORDERED_LIST = `<svg width="34" height="28" viewBox="0 0 34 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.0726 1.14537H9.60834C9.43155 1.14537 9.28691 1.29001 9.28691 1.4668V3.7168C9.28691 3.89358 9.43155 4.03823 9.60834 4.03823H33.0726C33.2494 4.03823 33.3941 3.89358 33.3941 3.7168V1.4668C33.3941 1.29001 33.2494 1.14537 33.0726 1.14537ZM33.0726 12.5561H9.60834C9.43155 12.5561 9.28691 12.7007 9.28691 12.8775V15.1275C9.28691 15.3043 9.43155 15.4489 9.60834 15.4489H33.0726C33.2494 15.4489 33.3941 15.3043 33.3941 15.1275V12.8775C33.3941 12.7007 33.2494 12.5561 33.0726 12.5561ZM33.0726 23.9668H9.60834C9.43155 23.9668 9.28691 24.1114 9.28691 24.2882V26.5382C9.28691 26.715 9.43155 26.8597 9.60834 26.8597H33.0726C33.2494 26.8597 33.3941 26.715 33.3941 26.5382V24.2882C33.3941 24.1114 33.2494 23.9668 33.0726 23.9668ZM0.608337 2.5918C0.608337 2.88727 0.666535 3.17985 0.779609 3.45283C0.892682 3.72582 1.05842 3.97386 1.26735 4.18279C1.47628 4.39172 1.72432 4.55745 1.9973 4.67053C2.27028 4.7836 2.56286 4.8418 2.85834 4.8418C3.15381 4.8418 3.44639 4.7836 3.71938 4.67053C3.99236 4.55745 4.2404 4.39172 4.44933 4.18279C4.65826 3.97386 4.82399 3.72582 4.93707 3.45283C5.05014 3.17985 5.10834 2.88727 5.10834 2.5918C5.10834 2.29632 5.05014 2.00374 4.93707 1.73076C4.82399 1.45778 4.65826 1.20974 4.44933 1.00081C4.2404 0.791875 3.99236 0.626141 3.71938 0.513068C3.44639 0.399995 3.15381 0.341797 2.85834 0.341797C2.56286 0.341797 2.27028 0.399995 1.9973 0.513068C1.72432 0.626141 1.47628 0.791875 1.26735 1.00081C1.05842 1.20974 0.892682 1.45778 0.779609 1.73076C0.666535 2.00374 0.608337 2.29632 0.608337 2.5918ZM0.608337 14.0025C0.608337 14.298 0.666535 14.5906 0.779609 14.8636C0.892682 15.1365 1.05842 15.3846 1.26735 15.5935C1.47628 15.8024 1.72432 15.9682 1.9973 16.0812C2.27028 16.1943 2.56286 16.2525 2.85834 16.2525C3.15381 16.2525 3.44639 16.1943 3.71938 16.0812C3.99236 15.9682 4.2404 15.8024 4.44933 15.5935C4.65826 15.3846 4.82399 15.1365 4.93707 14.8636C5.05014 14.5906 5.10834 14.298 5.10834 14.0025C5.10834 13.707 5.05014 13.4145 4.93707 13.1415C4.82399 12.8685 4.65826 12.6205 4.44933 12.4115C4.2404 12.2026 3.99236 12.0369 3.71938 11.9238C3.44639 11.8107 3.15381 11.7525 2.85834 11.7525C2.56286 11.7525 2.27028 11.8107 1.9973 11.9238C1.72432 12.0369 1.47628 12.2026 1.26735 12.4115C1.05842 12.6205 0.892682 12.8685 0.779609 13.1415C0.666535 13.4145 0.608337 13.707 0.608337 14.0025ZM0.608337 25.4132C0.608337 25.7087 0.666535 26.0013 0.779609 26.2743C0.892682 26.5472 1.05842 26.7953 1.26735 27.0042C1.47628 27.2131 1.72432 27.3789 1.9973 27.492C2.27028 27.605 2.56286 27.6632 2.85834 27.6632C3.15381 27.6632 3.44639 27.605 3.71938 27.492C3.99236 27.3789 4.2404 27.2131 4.44933 27.0042C4.65826 26.7953 4.82399 26.5472 4.93707 26.2743C5.05014 26.0013 5.10834 25.7087 5.10834 25.4132C5.10834 25.1178 5.05014 24.8252 4.93707 24.5522C4.82399 24.2792 4.65826 24.0312 4.44933 23.8222C4.2404 23.6133 3.99236 23.4476 3.71938 23.3345C3.44639 23.2214 3.15381 23.1632 2.85834 23.1632C2.56286 23.1632 2.27028 23.2214 1.9973 23.3345C1.72432 23.4476 1.47628 23.6133 1.26735 23.8222C1.05842 24.0312 0.892682 24.2792 0.779609 24.5522C0.666535 24.8252 0.608337 25.1178 0.608337 25.4132Z" fill="black" fill-opacity="0.85"/></svg>`
@Component({
  selector: 'cognum-menu-employee-items',
  templateUrl: './menu-employee-items.component.html',
  styleUrls: ['./menu-employee-items.component.scss'],
})
export class MenuEmployeeItemsComponent {
  menuItems = [
    {
      path: 'overview',
      text: 'Overview',
      icon: 'cognum-dashboard',
    },
    {
      path: 'chats',
      text: 'Chats',
      icon: 'cognum-robot',
    },
    {
      path: 'jobs',
      text: 'Jobs',
      icon: 'cognum-unordered-list',
    },
    // {
    //   path: 'history',
    //   text: 'History',
    //   icon: 'cognum-clock',
    // },
    {
      path: 'settings',
      text: 'Settings',
      icon: 'cognum-settings-filled',
    },
  ];

  constructor(
    private workspacesService: WorkspacesService,
    private aIEmployeesService: AIEmployeesService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIconLiteral('cognum-dashboard', sanitizer.bypassSecurityTrustHtml(DASHBOARD_ICON));
    iconRegistry.addSvgIconLiteral('cognum-robot', sanitizer.bypassSecurityTrustHtml(ROBOT_ICON));
    iconRegistry.addSvgIconLiteral('cognum-clock', sanitizer.bypassSecurityTrustHtml(CLOCK_ICON));
    iconRegistry.addSvgIconLiteral('cognum-database', sanitizer.bypassSecurityTrustHtml(DATABASE_ICON));
    iconRegistry.addSvgIconLiteral('cognum-settings-filled', sanitizer.bypassSecurityTrustHtml(SETTINGS_ICON));
    iconRegistry.addSvgIconLiteral('cognum-unordered-list', sanitizer.bypassSecurityTrustHtml(UNORDERED_LIST));
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }

  get employee() {
    return this.aIEmployeesService.aiEmployee;
  }
}
