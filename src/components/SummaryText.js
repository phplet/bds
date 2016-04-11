import React,{Component,StyleSheet,Text,View,Image,TouchableHighlight,Animated,Dimensions,TouchableOpacity} from 'react-native'; //Step 1

import Icon from 'react-native-vector-icons/FontAwesome';

import gui from '../lib/gui';

class SummaryText extends Component{
    constructor(props){
        super(props);

        this.icons = {     //Step 2
            'up'    : '\nThu gọn',
            'down'  : '... Xem thêm'
        };

        var maxDiaChiLength = 80;
        var longText = props.longText;
        var shortText = '';
        if (longText) {
            var length = longText.length;
            if (length > maxDiaChiLength) {
              length = maxDiaChiLength;
            }
            shortText = longText.substring(0,length);
        }
        this.state = {       //Step 3
            shortText       : shortText,
            longText       : longText,
            expanded    : props.expanded,
            animation   : new Animated.Value()
        };
    }

    toggle(){
      //Step 1
      let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
          finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

      this.setState({
          expanded : !this.state.expanded  //Step 2
      });

      this.state.animation.setValue(initialValue);  //Step 3
      Animated.spring(     //Step 4
          this.state.animation,
          {
              toValue: finalValue
          }
      ).start();  //Step 5
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight   : event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event){
        this.setState({
            minHeight   : event.nativeEvent.layout.height
        });
    }


    render(){
        if (this.state.shortText == this.state.longText) {
            return (
                <View>
                    <Text style={styles.text}>{this.state.shortText} </Text>
                </View>
            )
        }

        let icon = this.icons['down'];

        if(this.state.expanded){
            icon = this.icons['up'];   //Step 4

            //Step 5
            return (
                <Animated.View style={[styles.container,{height: this.state.animation}]} >

                  <TouchableOpacity
                    onPress={this.toggle.bind(this)}>
                    <View style={styles.minContainer} onLayout={this._setMinHeight.bind(this)}>
                        <Text style={styles.text}>{this.state.shortText}
                            <Text style={styles.button}>{icon}</Text>
                        </Text>
                    </View>
                  </TouchableOpacity>

                </Animated.View>
            );
        } else {
            //Step 5
            return (
                <Animated.View style={[styles.container,{height: this.state.animation}]} >

                  <TouchableOpacity
                    onPress={this.toggle.bind(this)}>
                    <View style={styles.maxContainer} onLayout={this._setMaxHeight.bind(this)}>
                        <Text style={styles.text}>{this.state.longText}
                            <Text style={styles.button}>{icon}</Text>
                        </Text>
                    </View>
                  </TouchableOpacity>

                </Animated.View>
            );
        }

    }
}

var styles = StyleSheet.create({
    container   : {
        backgroundColor: 'transparent',
        margin: 0,
        overflow:'hidden',
    },
    maxContainer : {
        flexDirection: 'row',
		alignItems: 'flex-start',
        justifyContent: 'flex-start',
        margin: 0
    },
    minContainer : {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        margin: 0
    },
    text       : {
        flex    : 1,
        color   :'black',
        fontFamily: 'Open Sans',
        fontSize: 14,
        textAlign: 'left',
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width-20,
        marginLeft: 0,
    },
    button      : {
        flex    : 1,
        color   :'blue',
        fontFamily: 'Open Sans',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
        backgroundColor: 'transparent',
        marginLeft: 0,
        alignItems: 'flex-start',
        marginBottom: 0
    }
});

export default SummaryText;
