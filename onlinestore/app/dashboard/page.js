import Dashboard from "@/components/Dashboard";
import Main from "@/components/Main";
import Login from "@/components/Login";


export const metadata = {
    title: "REA ⋅ Dashboard",
  };

export default function DashboardPage(){

    const isAuthenticated = false; //just while we design and build
    let children = (
        <Login/> //will render Login inside <Main>  </Main>
    )

    if (isAuthenticated)(
        children = (
            <Dashboard/> //if user is authenticated we can show Dashboard
        )
    )

    return (
        <Main>
            {children}
        </Main>
    )
}