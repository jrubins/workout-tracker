import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

const ApiMock = require('../apiMock')

process.env = {
  ...process.env,
  API_BASE_URL: ApiMock.API_BASE_URL_TEST,
}

configure({ adapter: new Adapter() })
