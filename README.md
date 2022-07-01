# Belly Button Biodiversity

## Overview
Using HTML (with Bootstrap) and JavaScript (with D3 and Plotly), create a Web page that displays navel washing frequency and bacterial sample count for a selected user ID.

## Web Page Customizations

### HTML / Bootstrap

- Altered column widths based on screen size (*e.g.*, mobile vs. desktop).

### CSS

- General Alterations
  - Changed background color.
- Jumbotron Alterations
  - Added image.
  - Created pseudo-class to separate image from text.
    - Changed opacity of image (leaving text opaque, due to pseudo-class).
  - Changed text size, color, and font weight.


### JavaScript

- Demographic Info Panel
  - Added function to ensure all GENDER values were in uppercase.
- All Charts
  - Made backgrounds transparent (so that page background color shows through).
- Bar Chart
  - Added axis labels.
- Gauge Chart
  - Altered chart height to reduce gap between title and top of chart.
  - Added units ("scrubs") to the last gauge tick.
- Bubble Chart
  - Added axis labels.
  - Set default hovermode to "closest".
  - Set bubble reference size to prevent samples with large counts from having overwhelmingly large bubbles.
