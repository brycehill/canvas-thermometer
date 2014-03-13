canvas-thermometer
==================

A thermometer graph built with canvas

```
<canvas id='canas' width='500' height='800'></canvas>
<script>
    var t = new Thermometer(document.getElementById('canvas'))

    t.set('goal', 200)
     .set('data', defValue)
     .draw()
</script>
```