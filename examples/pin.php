
<div class="example-pin <?php echo value('location', 'right'); ?>">
    <div class="pin" id="pin"<?php if ($height = value('height')) echo ' style="height: ' . $height . 'px"'; ?>>
        This div should stay positioned at the top right of the page, regardless of window scroll.<br><br>
        It will also stay contained within the parent.
    </div>

    <?php for ($i = 0; $i <= 10; $i++) { ?>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
    <?php } ?>
</div>

<script type="text/javascript">
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('pin').pin({
                location: <?php string('location', 'right'); ?>,
                xOffset: <?php number('xOffset', 0); ?>,
                yOffset: <?php number('yOffset', 0); ?>,
                throttle: <?php number('throttle', 50); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('#pin').pin({
                location: <?php string('location', 'right'); ?>,
                xOffset: <?php number('xOffset', 0); ?>,
                yOffset: <?php number('yOffset', 0); ?>,
                throttle: <?php number('throttle', 50); ?>
            });
        });
    <?php } ?>
</script>