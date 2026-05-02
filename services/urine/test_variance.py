import numpy as np

# vertical strip
cxs = [100, 102, 99, 101, 100, 105]
cys = [50, 100, 150, 200, 250, 300]
print("Vertical strip:")
print("std_x:", np.std(cxs))
print("std_y:", np.std(cys))

# random scattered boxes
cxs = [10, 200, 50, 300, 400, 150]
cys = [50, 100, 350, 200, 250, 500]
print("\nRandom scattered boxes:")
print("std_x:", np.std(cxs))
print("std_y:", np.std(cys))
