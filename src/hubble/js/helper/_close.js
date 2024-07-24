	 // Destructor
    destruct()
    {
        this.clearEventListeners();
    }
}

Container.singleton('Helper', HelperJS);
