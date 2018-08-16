import React from 'react';

class NoaMatch extends React.Component {
    render() {
        return (
            <div style={{height:'900px',fontSize:"50px",color:'#fff',textAlign:'center',display:'flex',justifyContent:'center',alignItems:"center"}}>
                      <p style={{fontSize:'60px',display:"block"}}> 404:   &nbsp;&nbsp;&nbsp;&nbsp;</p>
                    <p> 页面不存在，请检查路由</p> 
            </div>
        )
    }
}

export default NoaMatch;