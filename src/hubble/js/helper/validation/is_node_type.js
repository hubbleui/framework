/**
 * Is node type.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @param   {string} tag        Tag to compare
 * @returns {boolean}
 */
is_node_type(mixed_var, tag)
{
    return mixed_var.tagName.toUpperCase() === tag.toUpperCase();
}
