import React, { useEffect } from 'react';
import { mount } from "appModule/AppModule";
import { useLocation, useNavigate } from 'react-router-dom';
// import { createBrowserHistory } from "history";
// const history = createBrowserHistory();
// const RemoteAppModule = () => {
//     const navigate = useNavigate(); 
//     const location = useLocation();
 
//     useEffect(() => {
//         const { onParentNavigate } = mount({
//             onNavigate: ({pathname: nextPathname}) => {

//                 const { pathname } = location;
//                 // if (pathname !== nextPathname) {
//                 //     history.push(nextPathname);
//                 // }

//                 console.log('The container notice the path has changed',pathname, nextPathname)
//             }
//         });

//         // history.listen(onParentNavigate);

//     }, []);
//     return (
//         <div className="remote-module">
//             <app-root></app-root>
//         </div>
//     )
// }
// const RemoteAppModule = () => {
//     useEffect(() => {
//         mount();
//     }, []);


//     return (
//         <div className="remote-module">
//             <app-root></app-root>
//         </div>
//     )
// }
// export default RemoteAppModule;


export default function RemoteAppModule() {
    useEffect(() => {
        mount();
    }, []);
    return (
        <div className="remote-module">
            <app-root></app-root>
        </div>
    )
}


// export default function RemoteAppModule() {
//     const navigate = useNavigate(); 

//     useEffect(() => {
//         mount({
//             onNavigate: () => {
//                 console.log('container noticed the navigation from remotes')
//             }
//         });

//         // setTimeout(() => {
//         //     console.log('1')
//         //     navigate('/products/list')
//         //     console.log('2')
//         // }, 5000)
//     }, []);
//     return (
//         <div className="remote-module">
//             <app-root></app-root>
//         </div>
//     )
// }
