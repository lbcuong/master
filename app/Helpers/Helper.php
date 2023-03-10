<?php

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

function storeAvatar($request, $image, $disk, $imageUpdate = '')
{
    $fileName = "";
    if (isset($request->$image)) {
        $image = $request->file($image);
        $fileExtension = $image->getClientOriginalExtension();
        $fileName = Str::random(32) . '.' . $fileExtension;
        Storage::disk('avatar')->put($fileName, file_get_contents($image));
    } else {
        $fileName = $imageUpdate;
    }
    if (!empty($imageUpdate) && $fileName != $imageUpdate && $imageUpdate != config('const.default_user_avatar')) {
        Storage::disk('avatar')->delete($imageUpdate);
    }
    return config('filesystems.disks.avatar.url') . '/' . $fileName;
}
