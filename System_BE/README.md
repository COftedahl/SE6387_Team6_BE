# How to run

1. Build the app: npm run build
2. Run the app: npm start

# How to update swagger docs
1. Run: npm run swagger
*Note that the swagger docs are automatically updated every time <pre>npm start</pre> is run.*

# How to run tests
*Run any of the following with the text <pre>-- --coverage</pre> appended to get code coverage results as well.*

*Run any of the following with the text <pre>-- --verbose</pre> appended to get a succinct list of passes and fails for each test file as well. (If you add "-- --coverage" as seen above and want verbose, can use "-- --coverage --verbose")*

*To view the coverage report, access the files in "coverage/lcov-report/[filename].html" and view in browser.*
<dl>
  <dt>Option 1: </dt>
  <dl>
    Run all tests. Run <pre>npm run test</pre>
  </dl>

  <dt>Option 2: </dt>
  <dl>
    Run the API tests only. Run <pre>npm run "api tests"</pre>
  </dl>

  <dt>Option 3: </dt>
  <dl>
    Run the unit tests only. Run <pre>npm run "unit tests"</pre>
  </dl>
</dl>


<style>
  pre {
    color: black;
    background-color: rgb(220,235,245) !important;
  }
</style>