# Project background

In the field of computational materials science, predicting the existence of unknown compounds is one of the most important applications. Traditionally, experimentalists tweak already-published synthesis 'recipes' in hopes of finding new compounds. This trial-and-error approach often leads to far more failures than successes, and is highly expensive in time and money.  

Density functional theory (DFT) changed the way materials discovery can be done by providing a more reliable way to screen materials before experimentalists attempt to synthesize them. DFT calculations involve using supercomputers to find solutions to complex quantum mechanical equations which determine a material's energetics. The energetics can then be compared with those of competing phases in order to assess a material's overall stability. Most of the time (74% for half heuslers), a stabilty of 0 eV/atom indicates a composition is synthesizable.

While being correct 74% of the time is quite impressive, most materials classes have thousands to tens of thousands of possible candidates, so DFT stability still misclassifies hundreds, if not thousands, of promising materials. My machine learning model aims to replace this stability metric with a synthesizability metric which experimentalists may use to guide their search for new materials.

