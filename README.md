## nomark

nomark is a tiny, lite version of md aimed at making it easy to write classes and other attributes on html elements. it uses curly braces for nesting html elements. the spec is as mentioned below.

## nomark spec

1. file extension is .nm

2. all data is contained within curly braces {}

3. an element here implies an html tag

4. all elements start with {"\n" and end with "\n"}

5. elements can have deep nesting

6. elements can define it's type, classes and id's and ANY other attributes after the opening braces in the format mentioned in line 9.

7. if no element type is specified the default type will be a "div" tag

8. \*.class1 .class2 .class3 #id1 @type src=imagefromweb.com/1.jpg\*

9. escape character is \.

## example of nomark text

```
{
    *.flex .flex-col .items-center*
    {
        *.redbg .black .rounded .p-2 #text @p*
        someone said about javascript
    }
    {
        *@blockquote .font-bold*
        everything that can be written in javascript will be written in javascript.
    }
    {
        *@p .text-black .p-2*
        ever since javascript was introduced to the world for the first time in
        {
            *@strong*
            1994
        }
        it has continued to evolve to meet the ever rising expectations of developers. from being a
        {
            *@a `href=somewebsite.com/jshistory.html*
            cheap copy of java to attract java devs
        }
        to browser scripting to being the most used and popular language of all time, javascript has certainly come a long way.
    }
    {
        *@img `src=https://www.sleepzone.ie/uploads/images/PanelImages800x400/TheBurren/General/sleepzone_hostels_burren_800x400_14.jpg*
    }
    {
        *.flex*
        here are a few thing to keep in mind when starting with js
        {
            *@ul .list-style*
            {
                *@li*
                null and undefined are 2 very different things
            }
            {
                *@li*
                javascript might not neccessarily follow the top-down code execution flow you might expect from other languages like
                {
                    *@a `href=mohits.dev/tags/cpp*
                    c++ or java
                }
            }
            {
                *@li*
                equality and types in javascript might not be what you think it is.
                {
                    *@a `href=weirdjs.com/equality*
                    read more
                }
            }
        }
    }
    {
       {
            *.img @img `src=https://picsum.photos/350*
       }
    }
}
```

## usage

to parse nomark and generate the html

```js
import { parser, astToHtml } from 'nomark-js';

const string = getNomarkStringFromSomewhere();

const html = astToHtml(parser(string));
```

## more

i made this to be an easy writing format for my blog where i use tailwind classes for styling.
