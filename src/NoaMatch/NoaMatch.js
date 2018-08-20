import React from 'react';


class NoaMatch extends React.Component {

    constructor() {
        super();
      }
      state = {
        hei:document.body.clientHeight,
      }
    componentDidMount() {
        document.title = "404页面";
    }
    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    }
    onWindowResize=()=>{
        this.setState({
            hei:document.body.clientHeight,
          });
    }
    render() {
        return (
            <div style={{ width: '100%', height:this.state.hei,textAlign: "center", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <div className="head404">
                    <img src={require('./false.jpg')} alt="" style={{width:'50%'}}/>
                    </div>
                    <div className="txtbg404">
                        <div className="txtbox">

                            <p style={{color:'#87C2FF'}}>抱歉！您所访问的页面不存在，请重新加载</p>

                            <p className="paddingbox" style={{color:'#87C2FF'}}>请点击以下链接继续浏览网页</p>

                            <p><a href="http://watersupervision.terabits.cn" style={{color:'#87C2FF'}}>》返回网站首页</a></p>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default NoaMatch;