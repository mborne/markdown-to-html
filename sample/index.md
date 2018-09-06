# Sample markdown file

[[toc]]

## Description

This file provides a sample markdown for markdown2html

## Images

![Geometry types](img/geometry-types.png)

## Code without language

```
A code
```

## JS code

```javascript
function doSomething(){
    return "something";
}
```

## Inline code

Rendering an inline `doSomething()` code.

## Mermaid graph

```mermaid
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
```

## Links

### External markdown with relative path

* [Other file](other-file.md)
* [Part in other file](other-file.md#nacta-contribuere)

### External markdown with absolute path

* [GitHub link](https://github.com/jquery/jquery/blob/master/README.md)
