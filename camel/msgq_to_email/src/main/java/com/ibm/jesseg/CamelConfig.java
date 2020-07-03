package com.ibm.jesseg;

import java.util.Properties;
import java.lang.System;
import java.net.URLEncoder;
import java.io.BufferedReader;
import java.io.Console;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.FileInputStream;
import java.io.IOException;

/**
 * For main-line code, see the MainApp class.
 * <br>
 * This is a convenience class centered around reading values from a configuration
 * file (config.properties). Subclasses can provide URIs appropriate for establishing
 * Camel routes. Properties can also be overridden by Java system properties,
 * for instance, specifying -Dprop=value on the command line.
 * <br>
 * Also, the user can be prompted for any properties that are missing from the
 * configuration file.
 */
class CamelConfig {
    private Properties m_props = null;
    private Console m_console = System.console();
    private BufferedReader m_stdin = new BufferedReader(new InputStreamReader(System.in));

    private static boolean looksLikePassword(final String _prop) {
        if (null == _prop) {
            return false;
        }
        final String lowercase = _prop.toLowerCase();
        return lowercase.contains("pass") || lowercase.contains("pw");
    }
    private static Object obfuscatePropertyValue(final String _prop, final Object _value) {
        if(looksLikePassword(_prop)) {
            return "xxxxxxxxx";
        }
        return _value;
    }

    private String askUser(final String _prop) throws IOException {
        final String promptText = "Enter value for '" + _prop + "': ";
        if(null == m_console) {
            if (looksLikePassword(_prop)) {
                throw new RuntimeException("Can't properly ask for password ('" + _prop + "' property).");
            } else {
                System.out.print(promptText);
                return m_stdin.readLine();
            }
        } else {
            if (looksLikePassword(_prop)) {
                char[] pw = m_console.readPassword(promptText);
                return (null == pw) ? null : new String(pw);
            } else {
                return m_console.readLine(promptText);
            }
        }
    }

    /**
     * Returns the given property, or null if it doesn't exist
     */
    public synchronized String getProperty(final String _prop) throws IOException {
        return getProperty(_prop, null, false);
    }

    /**
     * Returns the given property. If the property is not set, the given default is returned.
     */
    public synchronized String getProperty(final String _prop, final String _default) throws IOException {
        return getProperty(_prop, _default, false);
    }

    /**
     * Returns the given property. If the property is not set, the given default is returned.
     * If the _abortIfNoValueOrDefault parameter is true, then a RuntimeException will be thrown
     * if the property is not set and the default value is null.
     */
    public synchronized String getProperty(final String _prop, final String _default, final boolean _abortIfNoValueOrDefault) throws IOException {
        if(null == m_props) {
            m_props = new Properties();
            String propertyFile = System.getProperty("camelconfig");
            final InputStream inputStream;
            if (null == propertyFile || propertyFile.isEmpty()) {
                inputStream = CamelConfig.class.getClassLoader().getResourceAsStream("config.properties");
            } else {
                inputStream = new FileInputStream(propertyFile);
            }
            if (null == inputStream) {
                throw new RuntimeException("ERROR: property file not found: " + propertyFile);
            } else {
                m_props.load(inputStream);
            }
        }
        Object ret = System.getProperty(_prop);
        if(null == ret) {
            ret = m_props.getProperty(_prop);
        }
        if(null == ret && null == _default) {
            String userInput = askUser(_prop);
            if(null != userInput && !userInput.trim().isEmpty()) {
                ret = userInput.trim();
            }
        }
        if(null == ret) {
            if(_abortIfNoValueOrDefault) {
                System.err.println("ERROR: Required configuration property not set: " + _prop);
                throw new RuntimeException("ERROR: Required configuration property not set: " + _prop);
            }
            System.out.println(""+_prop+"="+obfuscatePropertyValue(_prop, _default) + " (default)");
            return URLEncoder.encode(_default, "UTF-8");
        }
        System.out.println(""+_prop+"="+obfuscatePropertyValue(_prop,ret));
        return URLEncoder.encode(ret.toString(), "UTF-8");
    }
}