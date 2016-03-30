var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
} = React;

class PriceMarker extends React.Component{
  constructor(){
    super();
  }

  getDefaultProps() {
    return {
      fontSize: 11,
      color: '#FF5A5F'
    };
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.bubble, {backgroundColor: this.props.color, borderColor: this.props.color}]}>
          <Text style={[styles.amount, { fontSize: this.props.fontSize }]}>{this.props.amount} </Text>
          <Text style={styles.unit}>{this.props.unit ? this.props.unit : " $"}</Text>
        </View>
        <View style={[styles.arrowBorder,{borderTopColor: this.props.color}]} />
        <View style={[styles.arrow, {borderTopColor: this.props.color}]} />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: '#FF5A5F',
    padding: 2,
    borderRadius: 3,
    borderColor: '#D23F44',
    borderWidth: 0.5,
  },
  unit: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  amount: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

module.exports = PriceMarker;