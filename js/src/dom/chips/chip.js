(function()
{
    /**
     * Creates a chip
     *
     */
    function createChip(options)
    {
        let chip = document.createElement(options.removeable || options.input ? 'SPAN' : 'BUTTON');

        if (options.removeable || options.input) chip.type = 'button';

        chip.className = options.variant ? `btn btn-chip ${options.variant}` : 'btn btn-chip';
        chip.innerText = options.posticon || options.removeable ? `${options.text} ` : options.text;

        if (options.preicon)
        {
            let icon1 = document.createElement('SPAN');
            icon1.className = `fa fa-${options.preicon}`;
            chip.appendChild(icon1);
        }

        if (options.removeable)
        {
            let removeBtn = document.createElement('BUTTON');
            removeBtn.className = 'remove-btn btn-unstyled js-remove-btn';
            removeBtn.ariaLabel = 'remove';
            removeBtn.type = 'button';

            let x = document.createElement('SPAN');
            x.className = 'fa fa-xmark';
            removeBtn.appendChild(x);

            chip.appendChild(removeBtn);
        }
        else if (options.posticon)
        {
            let icon2 = document.createElement('SPAN');
            icon2.className = `fa fa-${options.posticon}`;
            chip.appendChild(icon2);
        }
        
        if (options.input)
        {
            let input = document.createElement('INPUT');
            input.hidden = true;
            input.name   = options.input;
            input.value  = options.text;
            input.setAttribute('value', options.text);

            chip.appendChild(input);
        }

        return chip;
    }

    // Load into FrontBx DOM core
    FrontBx.set('Chip', createChip);

})();