---
layout: post
title: 57Block Developer Homework
date: April 05, 2021
author: Álvaro José Agámez Licha
overview: Developer Homework for Senior Backend position
permalink: 57Blocks-developer-homework.html
tags:
- Casablanca
- North by Northwest
- The Man Who Wasn't There
---

# Developer Homework

Design a library that converts the values of the properties of an arbitrary object to another language/unit. The conversion rules are configurable.

The following requirements should be fulfilled:

1. The object is arbitrary. If a new object is added, no need to update the code to support it.
   * The maximum nest level of objects hierarchy is 10.
2. The object has properties of type string, integer, float, etc.
   * For strings please use a mock translation service.
   * There are properties of complex type: map, array, object, etc.
3. A configuration is provided so that the library knows which property to convert and how.
4. Please optimize and benchmark memory/cpu usage of your implementation, and send the result together with the code.

## Example

If the library is given an object below:

```json
{
  "name": "Some Company",
  "performance": {
      "revenue": 1234.00
  },
}
```

With a configuration (you don't need to have the exactly same format):

```
/performance/revenue 0.7
```

The library walks through the object hierarchy, find `performance.revenue` and do `1234.00 * 0.7` to get the converted value.
