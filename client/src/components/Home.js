import React from 'react'
import Feed from './Feed'

function Home() {
    return(
        <div>
            <h1 className="center">Welcome to SocioPage!</h1>
            <div className="row">
                <div className="col s8">
                    <Feed />
                </div>
                <div className="col s4">
                
                    <div className="card">
                        
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default Home;