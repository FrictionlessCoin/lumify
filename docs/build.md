# Build Instructions

In the majority of cases, most Lumify components can be built by simply opening a terminal to the component root
directory and running `mvn package`. The two most common components that are a little less straight-forward are the
web application and storm ingest components. Additional instructions for both can be found below.

## Storm Plugin Build Instructions

Each storm ingestion plugin can be build independently using the following Maven command.

```Shell
mvn package -pl <path_to_plugin_dir> -am
```

Once the plugin JAR file is created, copy it to the `/lumify/libcache` directory in HDFS.

```Shell
hadoop fs -put <path_to_plugin_jar> /lumify/libcache
```

As an example, to build and deploy the `tika-mime-type-plugin` one would run the following commands from the root of
the Lumify project.

```Shell
mvn package -pl storm/plugins/tika-mime-type -am
hadoop fs -put storm/plugins/tika-mime-type/target/lumify-tika-mime-*-jar-with-dependencies.jar /lumify/libcache
```

Lumify's storm topology will automatically detect the plugin in the classpath.

## Web Application Build Instructions

From the root directory of the Lumify project, run

```Shell
mvn package -P web-war -pl web/war -am -DskipTests -Dsource.skip=true
```

The previous command will create a WAR file in the `web/war/target` directory.

## Web Application Plugin Build Instructions

The Lumify web application can be extended with dynamically loaded plugins. You can find some example plugins in
`web/plugins`. To build a web plugin, simply run `mvn package` from the root directory of the plugin you want to build.

Once the plugin JAR file is created, copy it to the `/lumify/libcache` directory in HDFS. This is the easiest way to
expose the plugin to all web servers. The Lumify web application will automatically add the JAR file to the classpath.

```Shell
hadoop fs -put <path_to_plugin_jar> /lumify/libcache
```

To learn more about extending Lumify with plugins, please [read this](../web/war/src/main/webapp/README.md).