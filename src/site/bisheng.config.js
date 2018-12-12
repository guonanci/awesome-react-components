const path = require('path')
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default

const isDev = process.env.NODE_ENV === 'development'


moduels.exports = {
  port: 8081,
  source: {
    components: './components',
    docs: './docs',
    changeLog: ['CHANGELOG.md'],
  },
  theme: './site/theme',
  htmlTemplate: './site/theme/static/template.html',
  themeConfig: {
    categoryOrder: {
      'Ant Design': 0,
      Principles: 1,
      Visual: 2,
      Pattern: 3,
      Other: 6,
      Components: 100,
    },
    typeOrder: {
      General: 0,
      Layout: 1,
      Navigation: 2,
      'Data Entry': 3,
      'Data Display': 4,
      Feedback: 5,
      Other: 6,
    },
    docVersions: {
      '1.x': 'http://guonanci.github.io/awesome-react-components'
    },
  },
  doraConfig: {
    verbose: true
  },
  webpackConfig(config) {
    // eslint-disable-next-line
    config.resolve.alias = {
      'arc/lib': path.join(process.cwd(), 'components'),
      'arc/es': path.join(process.cwd(), 'components'),
      arc: path.join(process.cwd(), 'index'),
      site: path.join(process.cwd(), 'site'),
      'react-router': 'react-router/umd/ReactRouter',
    }

    // eslint-disable-next-line
    config.externals = {
      'react-router-dom': 'ReactRouterDOM',
    }

    if (isDev) {
      // eslint-disable-next-line
      config.devtool = 'source-map'
    }

    config.plugins.push(new CSSSplitWebpackPlugin({ size: 4000 }))

    return config
  }

  htmlTemplateExtraData: {
    isDev,
  }
}