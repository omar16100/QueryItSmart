import React, { Component } from 'react'
import classNames from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions/appActions'
import _ from 'lodash'
import SearchImage from './SearchImage/SearchImageTop'
import SearchDocument from './SearchDocument/Top'
import DemandForecast from './DemandForecast/Top'
import Circle from './Circle'
import Header from './Header'
import { CONTENT_CLASSES, CHANNEL_IMAGES } from '../const'
import lang from '../lang.json'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contents: CHANNEL_IMAGES,
      leave: false,
    }
  }
  onWindowResize(e) {
    this.props.actions.resizeWindow(window.innerWidth, window.innerHeight)
  }

  componentDidMount() {
    this.props.actions.resizeWindow(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }

  onClick(index) {
    const { contents } = this.state
    const { actions } = this.props
    const id = contents[index].id
    this.setState({leave: true})
    // For animation of leave
    setTimeout(() => {
      actions.selectChannel(index)
      this.setState({leave: false})
    }, 1000)
  }

  onMouseOver(index) {
    const BASE_INDEX = 100
    const { contents } = this.state
    const id = contents[index].id
    this.setState({
      contents: _.map(contents, (content, i) => {
        content.zIndex = BASE_INDEX + i
        if (content.id === id) {
          content.zIndex = BASE_INDEX + _.size(contents)
        }
        return content
      })
    })
  }

  renderHeader() {
    const { leave } = this.state
    if (leave) {
      return null
    }
    return (
      <Header
        title={ lang.app.title }
        subtitle={ lang.app.subtitle }
        style={{color: 'white'}}/>
    )
  }

  renderContents() {
    const { contents, leave } = this.state
    const { channel } = this.props.app
    return (
      <div className="content">
        { _.map(contents, (image, i) => {
          return <Circle
                    style={{zIndex: image.zIndex}}
                    key={ `channel-${i}` }
                    onClick={ this.onClick.bind(this, i) }
                    onMouseOver={ this.onMouseOver.bind(this, i) }
                    outerClassName={ leave ? "is-center leave":image.className }>
                    <img src={ image.src } />
                  </Circle>
          })
        }
      </div>
    )
  }

  renderFooter() {
    const { leave } = this.state
    if (leave) {
      return null
    }
    return (
      <div className="content-footer">
        <div className="flex-container">
          <div className={ classNames("flex-item") }>
            Wikimedia Commons Images
          </div>
          <div className={ classNames("flex-item") }>
            Stack Overflow Questions
          </div>
          <div className={ classNames("flex-item") }>
            NYC City Bike Usage Forecast
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { app, forecast } = this.props
    const { finished, showSQL } = forecast
    // For google map
    const style = finished && !showSQL ? {pointerEvents: 'none'} : {}
    return (
      <div id="container" style={style}>
        { do {
            if (app.channel === 0) {
              <SearchImage />
            } else if (app.channel === 1) {
              <SearchDocument />
            } else if (app.channel === 2) {
              <DemandForecast />
            } else {
              <div className={ classNames("container") } style={{ backgroundColor: 'black' }}>
                <ReactCSSTransitionGroup
                  transitionName="fadeinout"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={300}>
                  { this.renderHeader() }
                </ReactCSSTransitionGroup>
                { this.renderContents() }
                <ReactCSSTransitionGroup
                  transitionName="fadeinout"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={300}>
                  { this.renderFooter() }
                </ReactCSSTransitionGroup>
              </div>
            }
        }}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    app: state.app,
    forecast: state.forecast
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
