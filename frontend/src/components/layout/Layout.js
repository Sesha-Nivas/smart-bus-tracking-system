import React from "react";

function Layout({ children }) {
  return (

    // <div style={{ marginLeft: "220px", padding: "20px", width: "100%" }}>
      
    //   {children}

    // </div>

    <div style={{ display: "flex", backgroundColor: "#87CEEB", minHeight: "100vh" }}>{children}</div>

  );
}

export default Layout;