function requestInterceptor(RestangularProvider) {
  RestangularProvider.addFullRequestInterceptor(function (element, operation, what, url, headers, params) {
    if (operation == 'getList') {
      // custom pagination params
      if (params._page) {
        params.pager = params._page + ',' + params._perPage;
        delete params._page;
        delete params._perPage;
      }
      // custom sort params
      if (params._sortField) {
        params.sort = params._sortField + ',' + params._sortDir;
        delete params._sortField;
        delete params._sortDir;
      }
      // custom filters
      if (params._filters) {
        params.filter = params._filters;
        delete params._filters;
      }
    }
    return {params: params, headers: headers};
  });
}

function responseInterceptor(RestangularProvider) {
  //RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response) {
  //  if (operation == 'getList') {
  //    var contentRange = response.headers('Content-Range');
  //    response.totalCount = contentRange.split('/')[1];
  //  }
  //  return data;
  //});
}

export default {requestInterceptor, responseInterceptor}
