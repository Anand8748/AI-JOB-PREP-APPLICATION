import React from 'react'
import UploadBox from '../components/UploadBox'

const UploadPage = () => {
    return (
        <div className='mt-20 min-h-[calc(100vh-5rem)] flex items-center'>
            <div className='w-11/12 max-w-6xl mx-auto h-[35rem] glass-card rounded-3xl'>
                <UploadBox />
            </div>
        </div>
    )
}

export default UploadPage
