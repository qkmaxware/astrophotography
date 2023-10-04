# Gets all the keys from a hash

module KeysFilter
    def keys (input)
        input.keys
    end
end

Liquid::Template.register_filter(KeysFilter)