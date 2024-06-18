	 // Destructor
    destruct()
    {
        this.clearEventListeners();
    }
}

Container.singleton('Helper', HelperJS);

console.log(Container.get('Helper'));