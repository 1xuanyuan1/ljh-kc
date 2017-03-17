/**
 * Created by Duke on 12/19/16.
 */
import { FindIndexCountResource, FindAllWordResource, FindAllAdvertiser } from './resources'

export default {
  getFindIndexCount: function () {
    return FindIndexCountResource.get()
  },
  getAllWord: function (params) {
    return FindAllWordResource.get(params)
  },
  getAllAdvertiser: function (params) {
    return FindAllAdvertiser.get(params)
  }
}
