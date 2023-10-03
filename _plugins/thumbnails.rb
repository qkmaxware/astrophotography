# Generates thumbnail images for each photo
require 'mini_magick'
require 'fileutils'

module Jekyll
    class ThumbnailGenerator < Jekyll::Generator
        def generate(site)
            images = site.static_files.select { |file| file.extname =~ /^\.(png|jpg|jpeg|bmp)$/i  }

            for image in images
                from = image.path
                to = "_site/generated/thumbnails" + image.relative_path

                if File.exists?(to)
                    # do nothing, thumbnail exists
                else
                    FileUtils.mkdir_p(File.dirname(to))
                    image = MiniMagick::Image.open(
                        from
                    )
                    image.resize "25%"
                    image.write(to)
                    puts("Convert " + from + " -> " + to)
                end
            end
        end
    end
end