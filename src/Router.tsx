import LayoutAuth from "./layouts/LayoutAuth";
import PageLogin from "./pages/auth/PageLogin";
import PageErrorNotfound from "./pages/PageErrorNotfound";
import {createBrowserRouter} from "react-router-dom";
import PageAppList from "./pages/console/app/app-list/PageAppList";
import PageAppEditor from "./pages/console/app/app-editor/PageAppEditor";
import PageFormList from "./pages/console/form/PageFormList";
import PageUserList from "./pages/console/user/PageUserList";
import PageUserDetail from "./pages/console/user/PageUserDetail";
import PageFormEditor from "./pages/console/form/editor/PageFormEditor";
import PageFormRecordList from "./pages/console/form/PageFormRecordList";
import PageFormRecord from "./pages/console/form/PageFormRecord";
import PageScriptList from "./pages/console/script/PageScriptList";
import PageScriptEditor from "./pages/console/script/PageScriptEditor";
import PageAppComponentList from "./pages/console/app/app-component-list/PageAppComponentList";
import PageAccount from "./pages/account/PageAccount";
import PageProjectSetting from "./pages/console/project-setting/PageProjectSetting";
import PagePermissionList from "./pages/console/authorization/PagePermissionList";
import PageRoleList from "./pages/console/authorization/PageRoleList";
import PageRolePermissions from "./pages/console/authorization/PageRolePermissions";
import PageUserRoles from "./pages/console/user/PageUserRoles";
import {RecordTypeEnum} from "./hype/classes/constant";
import FormRender from "./pages/hype-forms/FormRender";
import React from "react";
import {PageNote} from "./pages/PageNote";

export const router = createBrowserRouter([
    {
        path: '/hype-forms/:formSlug/records/:id',
        element: <FormRender/>,
    },
    {
        path: '/hype-forms/:formSlug/records',
        element: <FormRender/>,
    },
    {
        path: '/hype-forms/:formSlug',
        element: <FormRender/>
    },
    {
        path: '/notes',
        element: <PageNote/>
    },
    {
        path: "/",
        element: <LayoutAuth/>,
        children: [
            {
                path: '/account',
                element: <PageAccount/>,
            },
            {
                path: '/console',
                children: [
                    {
                        path: 'apps',
                        element: <PageAppList/>,
                    },
                    {
                        path: 'app-components',
                        element: <PageAppComponentList/>,
                    },
                    {
                        path: 'apps/:id/editor',
                        element: <PageAppEditor/>,
                    },
                    {
                        path: 'forms',
                        element: <PageFormList/>,
                    },
                    {
                        path: 'forms/:id/editor',
                        element: <PageFormEditor/>,
                    },
                    {
                        path: 'forms/:id/records',
                        element: <PageFormRecordList recordType={RecordTypeEnum.PROD}/>,
                    },
                    {
                        path: 'forms/:id/dev-records',
                        element: <PageFormRecordList recordType={RecordTypeEnum.DEV}/>,
                    },
                    {
                        path: 'forms/:formId/dev-records/preview',
                        element: <PageFormRecord recordType={RecordTypeEnum.DEV} layout={'DRAFT'}
                                                 formMode={'PREVIEW'}/>,
                    },
                    {
                        path: 'forms/:formId/dev-records/:id',
                        element: <PageFormRecord recordType={RecordTypeEnum.DEV} layout={'DRAFT'}
                                                 formMode={'PREVIEW'}/>,
                    },
                    {
                        path: 'forms/:formId/records/preview',
                        element: <PageFormRecord recordType={RecordTypeEnum.DEV} layout={'ACTIVE'}
                                                 formMode={'NORMAL'}/>,
                    },
                    {
                        path: 'forms/:formId/records/:id',
                        element: <PageFormRecord recordType={RecordTypeEnum.PROD} layout={'ACTIVE'}
                                                 formMode={'NORMAL'}/>,
                    },
                    {
                        path: 'permissions',
                        element: <PagePermissionList/>,
                    },
                    {
                        path: 'roles',
                        element: <PageRoleList/>,
                    },
                    {
                        path: 'roles/:id',
                        element: <PageRolePermissions/>,
                    },
                    {
                        path: 'scripts',
                        element: <PageScriptList/>,
                    },
                    {
                        path: 'scripts/:id',
                        element: <PageScriptEditor/>,
                    },
                    {
                        path: 'users',
                        element: <PageUserList/>,
                    },
                    {
                        path: 'users/:userId/roles',
                        element: <PageUserRoles/>,
                    },
                    {
                        path: 'users/:uid',
                        element: <PageUserDetail/>,
                    }, {
                        path: 'project-setting',
                        element: <PageProjectSetting/>,
                    },

                ]
            },
        ],
    },


    {
        path: "/login",
        element: <PageLogin/>,
    },
    {
        path: "*",
        element: <PageErrorNotfound/>,
    },
])
