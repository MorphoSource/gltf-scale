#! /usr/bin/env node

import pkg from '@caporal/core';
const { program } = pkg;

import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { NodeIO } from '@gltf-transform/core';

import draco3d from 'draco3dgltf';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';

import { scale } from './scale.js';

program
  .name("gltf-rescale")
  .version("0.0.1")
  .description("Rescale GLTF or GLB 3D assets. Based on @gltf-transform/functions.")
  .argument("<input>", "GLTF or GLB file to scale")
  .argument("<output>", "Path to write output scaled asset")
  .argument("<scale>", "Uniform multiplicative scale factor used to scale asset")
  .action(async ({ args }) => {
    // Parse document
    await MeshoptDecoder.ready;
    await MeshoptEncoder.ready;
    const dependencies = {
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
      'meshopt.decoder': MeshoptDecoder,
      'meshopt.encoder': MeshoptEncoder,
    };

    const io = new NodeIO()
      .registerExtensions(ALL_EXTENSIONS)
      .registerDependencies(dependencies);

    const document = await io.read(args.input);

    // Transform document
    await document.transform(scale({factor: args.scale}));

    // Write scaled document
    await io.write(args.output, document);
  })

program.run()