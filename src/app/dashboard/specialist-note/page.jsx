
import React from "react";

const page = () => {
  return (
    <div>
      <div className="mb-10">
        <h1 className="sectionHeading">Notes</h1>
      </div>
      <div className="flex flex-col items-center justify-center pt-12">
        <p className="text-sm mb-4 font-semibold text-gray-700">
          You have no note yet!
        </p>
        {/* <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"lg"} variant={"outline"}>
                <Plus /> Create Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>
                  Anyone who has this link will be able to view this.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2"></div>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button" >
                    Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div> */}
      </div>
    </div>
  );
};

export default page;
