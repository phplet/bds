'use strict';
import React, {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import gui from '../lib/gui';


var { createIconSet } = require('react-native-vector-icons');
var glyphMap = { 'heart':59457, 'heart-o':59458,'arrow-left': 59463,'map':59468, 'menu': 59470, 'arrow-right' : 59492,
    'search' : 59494, 'twitter' : 59503, 'arrow-up' : 59505, 'arrow-down' : 59445, 'facebook' : 59400, 'phone' : 59404,
    'check' : 59431};
var Icon = createIconSet(glyphMap, 'TruliaIcon');

class TruliaIconButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var {touchableProps, iconProps, textProps, mainProps, color, text, name,size} = this.props;
        return(
            <TouchableHighlight underlayColor='transparent' style={[styles.touchable]} onPress={this.props.onPress}>
                <View style={[styles.container, mainProps]} >
                    <Icon color={color||gui.mainColor} name={name} size={size||22} {...iconProps} />
                    <Text style={[styles.text, {color:color||gui.mainColor}, textProps]}>
                        {text}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    touchable: {
        overflow: 'hidden'
    },
    icon: {
        marginRight: 0
    },
    text: {
        fontSize:16
        , fontFamily:gui.fontFamily
        , fontWeight: '600',
        backgroundColor: 'transparent',
        paddingLeft: 0
    }
});



export default TruliaIconButton;
