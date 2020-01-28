import React, { Component } from "react";
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
 
const images = [{
    // Simplest usage.
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
 
    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance
 
    // You can pass props to <Image />
}, {
    props: {
        // Or you can set source directory.
        url: '',
        source: require('./icons/Rain_Tanjim.jpg')
    }
}]
 
export default class App extends React.Component {
    render() {
        return (
            <Modal visible={true} transparent={true}>
                <ImageViewer imageUrls={images}/>
            </Modal>
        )
    }
}